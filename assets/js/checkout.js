/* Trang thanh toán: khi vào từ nút "Mua ngay" (checkout.html?name=...&price=...&qty=...),
   tóm tắt đơn hàng chỉ gồm sản phẩm vừa chọn. Không có tham số thì giữ nguyên nội dung giỏ hàng. */
(function () {
  var SHIP = 30000;
  var summary = document.querySelector('.summary');
  var p = new URLSearchParams(location.search);
  var name = p.get('name'), price = parseInt(p.get('price'), 10), qty = parseInt(p.get('qty'), 10);
  if (!summary || !name || !(price > 0) || !(qty > 0)) return;

  var money = function (n) { return n.toLocaleString('vi-VN') + ' ₫'; };
  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text != null) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }
  function row(label, value, cls) {
    var d = el('div');
    d.append(el(label === 'Tổng' ? 'b' : 'span', label), el('b', value, cls));
    return d;
  }

  var subtotal = price * qty;
  summary.replaceChildren(
    el('h3', 'Đơn hàng của bạn'),
    row(name + ' × ' + qty, money(subtotal)),
    el('hr'),
    row('Tạm tính', money(subtotal)),
    row('Phí giao hàng', money(SHIP)),
    el('hr'),
    row('Tổng', money(subtotal + SHIP), 'price')
  );
})();
