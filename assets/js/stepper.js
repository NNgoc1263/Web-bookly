/* Nút tăng/giảm số lượng (.stepper): dùng ở trang chi tiết sách và giỏ hàng.
   Số lượng tối thiểu là 1; nếu .stepper có data-max (số lượng còn lại) thì không vượt quá mức đó.
   Mỗi lần đổi giá trị sẽ phát sự kiện "change" để nơi khác (giỏ hàng, giá mua ngay) tính lại tiền. */
(function () {
  document.querySelectorAll('.stepper').forEach(function (stepper) {
    var input = stepper.querySelector('.qty');
    if (!input) return;
    var max = Number(stepper.dataset.max) || Infinity;
    var minus = stepper.querySelector('button[data-d="-1"]');
    var plus = stepper.querySelector('button[data-d="1"]');

    function clamp(v) { return Math.min(max, Math.max(1, parseInt(v, 10) || 1)); }
    function sync() {                                  // làm mờ nút khi chạm giới hạn
      var q = clamp(input.value);
      if (minus) minus.disabled = q <= 1;
      if (plus) plus.disabled = q >= max;
    }

    stepper.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-d]');
      if (!btn || btn.disabled) return;
      input.value = clamp(clamp(input.value) + parseInt(btn.dataset.d, 10));
      sync();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    input.addEventListener('change', function () { input.value = clamp(input.value); sync(); });
    sync();
  });
})();
