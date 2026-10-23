/* Giỏ hàng: đổi số lượng thì tính lại thành tiền từng sách, tạm tính, tổng đơn và số sản phẩm trên đầu trang.
   Mỗi dòng sách (.cart-row[data-price]) mang đơn giá trong data-price. */
(function () {
  var SHIP = 30000;
  var rows = document.querySelectorAll('.cart-row[data-price]');
  if (!rows.length) return;

  var money = function (n) { return n.toLocaleString('vi-VN') + ' ₫'; };
  var setAll = function (key, text) {
    document.querySelectorAll('[data-cart="' + key + '"]').forEach(function (el) { el.textContent = text; });
  };

  function update() {
    var subtotal = 0, count = 0;
    rows.forEach(function (row) {
      var qty = Math.max(1, parseInt(row.querySelector('.qty').value, 10) || 1);
      var line = qty * Number(row.dataset.price);
      row.querySelector('.line-total').textContent = money(line);
      subtotal += line;
      count += qty;
    });
    setAll('subtotal', money(subtotal));
    setAll('total', money(subtotal + SHIP));
    setAll('count', count + ' sản phẩm');
  }

  // Lắng nghe ở cấp tài liệu: chạy sau khi stepper.js đã chuẩn hóa giá trị ô số lượng
  document.addEventListener('change', function (e) { if (e.target.closest('.cart-row')) update(); });
  document.addEventListener('input', function (e) { if (e.target.closest('.cart-row')) update(); });
  update();
})();
