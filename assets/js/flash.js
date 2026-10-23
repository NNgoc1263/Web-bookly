/* Thông báo (flash) không còn phụ thuộc vào "#id" trên thanh địa chỉ.
   - Bấm nút/link có href="#id" trỏ tới một thông báo: hiện thông báo ngay tại trang, KHÔNG đổi URL
     => không tạo thêm mục trong lịch sử, nên bấm "Quay lại" sẽ không hiện lại thông báo.
   - Trang được mở bằng "...#id" (đăng nhập, gửi form, ...): hiện thông báo một lần rồi xoá "#id" khỏi URL
     (thay thế mục lịch sử hiện tại), nên quay lui/tiến lên/tải lại cũng không hiện lại.
   - Trang được khôi phục từ bộ nhớ đệm khi quay lui (bfcache): ẩn mọi thông báo còn sót. */
(function () {
  var timer = null;

  function isFlash(el) { return el && el.classList && el.classList.contains('flash'); }

  function hideAll() {
    clearTimeout(timer);
    document.querySelectorAll('.flash.show').forEach(function (f) { f.classList.remove('show'); });
  }

  function show(el) {
    hideAll();
    void el.offsetWidth;                 // khởi động lại hiệu ứng nếu bấm liên tiếp
    el.classList.add('show');
    timer = setTimeout(function () { el.classList.remove('show'); }, 4600);
  }

  /* Bỏ phần "#..." khỏi URL mà không tạo mục lịch sử mới và không cuộn trang. */
  function stripHash() {
    if (!location.hash) return;
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (err) { /* file:// cũ */ }
  }

  function targetOf(href) {
    if (!href || href.charAt(0) !== '#' || href.length < 2) return null;
    return document.getElementById(decodeURIComponent(href.slice(1)));
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = targetOf(a.getAttribute('href'));
    if (!isFlash(el)) return;
    e.preventDefault();
    // Đang mở hộp xác nhận (:target)? Đóng nó bằng cách bỏ "#..." khỏi URL.
    var cur = location.hash && document.getElementById(location.hash.slice(1));
    if (cur && !isFlash(cur)) stripHash();
    show(el);
  });

  function onLoad() {
    var el = targetOf(location.hash);
    if (isFlash(el)) {
      stripHash();
      show(el);
    }
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) hideAll();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onLoad);
  else onLoad();
})();
