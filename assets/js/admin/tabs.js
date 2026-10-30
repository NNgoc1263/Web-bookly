/* Tab trạng thái đơn hàng: bấm vào tab nào thì tab đó đậm màu (đang chọn), các tab còn lại trở về bình thường. */
(function () {
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.order-tabs a');
    if (!tab) return;
    e.preventDefault();
    var box = tab.closest('.order-tabs');
    box.querySelectorAll('a').forEach(function (a) {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-current', 'true');
  });
})();
