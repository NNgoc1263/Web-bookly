/* Trang chi tiết đơn hàng (pages/admin/order-detail.html?id=DH1030&from=orders|stats).
   Dữ liệu lấy từ data.js. Admin xử lý đơn ngay tại đây (xác nhận, giao hàng, đã giao, hủy);
   trạng thái chỉ đổi trên trang này (minh họa), tải lại trang sẽ về như ban đầu. */
(function () {
  var D = BOOKLY;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var money = function (n) { return n.toLocaleString('vi-VN') + ' ₫'; };

  var params = new URLSearchParams(location.search);
  var id = (params.get('id') || '').replace('#', '').toUpperCase();
  var order = D.ORDERS[id];

  var back = document.getElementById('od-back');
  if (params.get('from') === 'stats') { back.href = 'index.html#stats'; back.textContent = 'Về thống kê'; }

  var card = document.getElementById('od-card');
  var title = document.getElementById('od-title');
  if (!order) {
    title.textContent = 'Không tìm thấy đơn hàng';
    card.innerHTML = '<div class="odx-box"><p>Đơn hàng <b>' + esc(id || '(trống)') + '</b> không tồn tại. Hãy quay lại danh sách và chọn lại.</p></div>';
    return;
  }
  document.title = 'BOOKLY - Chi tiết đơn #' + id;
  title.textContent = 'Chi tiết đơn hàng';

  var STEP_IDX = { wait: 0, confirm: 1, ship: 2, done: 3 };
  var BADGE = { wait: 'is-wait', confirm: '', ship: 'is-ship', done: 'is-done', cancel: 'is-cancel' };

  /* Thao tác theo trạng thái (giống các nút ở danh sách đơn): [nút, trạng thái mới, thông báo, kiểu thông báo, nút nguy hiểm?] */
  var ACTIONS = {
    wait:    [['Xác nhận đơn', 'confirm', 'Đã xác nhận đơn #', ''], ['Hủy đơn', 'cancel', 'Đã hủy đơn #', 'flash-cancel', true]],
    confirm: [['Giao hàng', 'ship', 'Đơn # đã chuyển sang đang giao', 'flash-ship'], ['Hủy đơn', 'cancel', 'Đã hủy đơn #', 'flash-cancel', true]],
    ship:    [['Đã giao', 'done', 'Đơn # đã giao thành công', 'flash-done']]
  };
  var HINT = {
    wait: 'Đơn đang chờ bạn xác nhận.',
    confirm: 'Đơn đã xác nhận, sẵn sàng giao cho đơn vị vận chuyển.',
    ship: 'Đơn đang trên đường giao đến khách.',
    done: 'Đơn đã giao thành công, không còn thao tác nào.',
    cancel: 'Đơn đã bị hủy, không còn thao tác nào.'
  };

  var flash = document.getElementById('od-flash'), flashTimer = null;
  function notify(text, cls) {
    clearTimeout(flashTimer);
    flash.className = 'flash ' + (cls || '');
    flash.textContent = text;
    void flash.offsetWidth;                 // khởi động lại hiệu ứng nếu bấm liên tiếp
    flash.classList.add('show');
    flashTimer = setTimeout(function () { flash.classList.remove('show'); }, 4600);
  }

  /* Hộp xác nhận trước khi hủy đơn */
  var box = document.getElementById('od-confirm'), pending = null;
  function closeBox() { box.classList.remove('open'); pending = null; }
  document.getElementById('od-confirm-no').addEventListener('click', closeBox);
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });
  document.getElementById('od-confirm-yes').addEventListener('click', function () {
    var a = pending; closeBox();
    if (a) apply(a);
  });

  function apply(a) {
    order.status = a[1];
    render();
    notify(a[2].replace('#', '#' + id), a[3]);
  }

  function render() {
    var st = order.status;
    var steps;
    if (st === 'cancel') {
      steps = '<ol class="odx-steps" style="--n:2"><li class="done">Đặt hàng<small>' + esc(order.date) + '</small></li><li class="cancel">Đã hủy</li></ol>';
    } else {
      var cur = STEP_IDX[st];
      steps = '<ol class="odx-steps">' + ['Đặt hàng', 'Xác nhận', 'Đang giao', 'Đã giao'].map(function (nm, i) {
        var cls = i < cur ? 'done' : (i === cur ? 'current' : '');
        return '<li class="' + cls + '">' + nm + (i === 0 ? '<small>' + esc(order.date) + '</small>' : '') + '</li>';
      }).join('') + '</ol>';
    }

    var sub = 0, count = 0;
    var rows = order.items.map(function (it) {
      var book = D.BOOKS[it[0]];
      sub += book[0] * it[1]; count += it[1];
      return '<div class="odx-row"><img src="' + book[1] + '" alt="Bìa sách ' + esc(it[0]) + '">' +
             '<div><span class="odx-row-name">' + esc(it[0]) + '</span><span class="odx-row-sub">' + money(book[0]) + ' × ' + it[1] + '</span></div>' +
             '<b class="odx-row-total">' + money(book[0] * it[1]) + '</b></div>';
    }).join('');

    var payState = st === 'cancel' ? ['Không phát sinh thanh toán', '']
      : order.pay === 'online' ? ['Đã thanh toán', 'ok']
      : st === 'done' ? ['Đã thu tiền khi giao hàng', 'ok'] : ['Chưa thu tiền (thanh toán khi giao hàng)', ''];
    var payName = order.pay === 'online' ? 'Thanh toán trực tuyến' : 'Thanh toán khi nhận hàng (COD)';

    var acts = (ACTIONS[st] || []).map(function (a, i) {
      return '<button type="button" class="' + (a[4] ? 'admin-btn admin-btn-danger' : 'btn') + '" data-act="' + i + '">' + a[0] + '</button>';
    }).join('');

    card.innerHTML =
      '<div class="odx">' +
        '<div class="odx-main">' +
          '<section class="odx-box odx-head"><div><span class="odx-label">Mã đơn hàng</span><p class="odx-code">#' + esc(id) + '</p>' +
            '<p class="odx-date">Đặt ngày ' + esc(order.date) + '</p></div>' +
            '<span class="odx-badge ' + BADGE[st] + '">' + D.STATUS[st] + '</span></section>' +
          '<section class="odx-box"><h3>Xử lý đơn hàng</h3><p class="odx-hint">' + HINT[st] + '</p>' +
            (acts ? '<div class="odx-process">' + acts + '</div>' : '') + '</section>' +
          '<section class="odx-box"><h3>Tiến trình đơn hàng</h3>' + steps + '</section>' +
          '<section class="odx-box odx-items"><h3>Sản phẩm (' + count + ')</h3>' + rows + '</section>' +
        '</div>' +
        '<aside class="odx-side">' +
          '<section class="odx-box"><h3>Khách hàng</h3><dl class="odx-info">' +
            '<div><dt>Người nhận</dt><dd>' + esc(order.name) + '</dd></div>' +
            '<div><dt>Số điện thoại</dt><dd>' + esc(order.phone) + '</dd></div>' +
            '<div><dt>Địa chỉ giao hàng</dt><dd>' + esc(order.addr) + '</dd></div></dl></section>' +
          '<section class="odx-box"><h3>Thanh toán</h3><dl class="odx-info">' +
            '<div><dt>Phương thức</dt><dd>' + payName + '</dd></div>' +
            '<div><dt>Trạng thái</dt><dd class="' + payState[1] + '">' + payState[0] + '</dd></div></dl></section>' +
          '<section class="odx-box"><h3>Tổng kết đơn hàng</h3><dl class="odx-sum">' +
            '<div><dt>Tạm tính (' + count + ' sản phẩm)</dt><dd>' + money(sub) + '</dd></div>' +
            '<div><dt>Phí giao hàng</dt><dd>' + money(D.SHIP) + '</dd></div>' +
            (order.discount ? '<div class="off"><dt>Giảm giá</dt><dd>−' + money(order.discount) + '</dd></div>' : '') +
            '<div class="total"><dt>Tổng cộng</dt><dd>' + money(D.orderTotal(order)) + '</dd></div></dl></section>' +
          '<div class="odx-actions"><a class="btn-outline arrow-back" href="' + back.getAttribute('href') + '">' + back.textContent + '</a></div>' +
        '</aside>' +
      '</div>';
  }

  card.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = ACTIONS[order.status][Number(b.dataset.act)];
    if (a[1] === 'cancel') {
      pending = a;
      document.getElementById('od-confirm-text').innerHTML = 'Bạn có chắc muốn hủy đơn <b>#' + esc(id) + '</b> của ' + esc(order.name) + '? Sau khi hủy sẽ không thể khôi phục.';
      box.classList.add('open');
    } else apply(a);
  });

  render();
})();
