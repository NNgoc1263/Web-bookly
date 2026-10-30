/* Phân trang minh họa: bấm số thì nút đó sáng lên, bấm ‹ › thì sáng nút liền trước/sau.
   Nội dung trang giữ nguyên, không chuyển trang; mỗi lần đổi trang sẽ cuộn về đầu trang (admin: về đầu phần đang xem). */
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
    if (box.closest('.admin-pager')) {
      // admin: cuộn về đầu phần (khối) đang xem, giống bên user
      var sec = box.closest('.admin-box') || box.closest('section');
      if (sec) {
        try { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) { sec.scrollIntoView(); }
      }
    } else {
      toTop();
    }
  });
})();
