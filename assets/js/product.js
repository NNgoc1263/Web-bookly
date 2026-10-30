/* Trang chi tiết sách: (1) chuyển tab Mô tả / Thông tin chi tiết;
   (2) gắn số lượng vào nút "Mua ngay" (trang người dùng) để trang thanh toán hiển thị đúng sản phẩm và số lượng. */
(function () {
  var more = document.getElementById('pd-more');
  if (!more) return;
  var tabs = Array.prototype.slice.call(more.querySelectorAll('[role="tab"]'));
  more.classList.add('js-tabs');          // không có JS thì hiện tất cả các mục nối tiếp nhau

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  select(tabs[0]);
})();

(function () {
  var box = document.querySelector('.product-detail[data-price]');
  if (!box) return;

  var price = Number(box.dataset.price);
  var input = box.querySelector('.qty');
  var max = Number(box.querySelector('.stepper').dataset.max) || Infinity;
  var buy = box.querySelector('.buy-now');

  function update() {
    var qty = Math.min(max, Math.max(1, parseInt(input.value, 10) || 1));
    if (buy && buy.dataset.checkout) {
      buy.href = buy.dataset.checkout + '?' + new URLSearchParams({ name: box.dataset.name, price: price, qty: qty });
    }
  }

  // Chạy sau stepper.js (đã chuẩn hóa ô số lượng) vì lắng nghe ở cấp tài liệu
  document.addEventListener('change', function (e) { if (box.contains(e.target)) update(); });
  document.addEventListener('input', function (e) { if (box.contains(e.target)) update(); });
  update();
})();
