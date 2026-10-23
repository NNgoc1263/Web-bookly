/* Phân trang: bấm số thì nút đó sáng lên, bấm ‹ › thì sáng nút liền trước/sau.
   Mỗi lần đổi trang sẽ phát sự kiện "pagechange" (detail = số trang) trên khung .pagination để nơi khác đổi nội dung
   (bảng sản phẩm admin dùng cách này); các phân trang khác chỉ minh họa nên không làm gì thêm. */
(function () {
  /* Cuộn về đầu trang: cuộn mượt cho cửa sổ, đồng thời đặt lại mọi vùng cuộn bên trong (nếu có). */
  function toTop() {
    var se = document.scrollingElement || document.documentElement;
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
    // phòng khi cuộn mượt bị trình duyệt bỏ qua (ví dụ bật giảm chuyển động): đặt thẳng về 0 sau một lúc
    setTimeout(function () { if (se.scrollTop > 0) se.scrollTop = 0; }, 700);
    document.querySelectorAll('.admin-main, main, .table-scroll').forEach(function (el) {
      if (el.scrollTop > 0) el.scrollTop = 0;
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('.pagination a');
    if (!link) return;
    e.preventDefault();                       // không nhảy lên đầu trang
    var box = link.closest('.pagination');
    if (box.hasAttribute('data-managed')) return;   // pager tự vẽ lại số trang (vd. bảng sản phẩm admin)
    var nums = Array.prototype.filter.call(box.querySelectorAll('a'), function (a) {
      var t = a.textContent.trim();
      return t !== '‹' && t !== '›';
    });
    var cur = box.querySelector('a.active');
    var target = link;
    var t = link.textContent.trim();
    if (t === '‹' || t === '›') {
      var i = nums.indexOf(cur);
      var j = t === '‹' ? i - 1 : i + 1;
      if (j < 0 || j >= nums.length) return;  // đang ở đầu/cuối thì giữ nguyên
      target = nums[j];
    }
    if (cur) cur.classList.remove('active');
    target.classList.add('active');
    box.dispatchEvent(new CustomEvent('pagechange', { detail: Number(target.textContent) }));
    if (!box.closest('.admin-pager')) toTop();   // admin: không cuộn về đầu trang
  });
})();
