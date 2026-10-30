/* Đăng nhập quản trị (minh họa, chạy hoàn toàn trên trình duyệt).
   - Trang admin (có thuộc tính data-admin-guard trên <html>): chưa đăng nhập thì chuyển về login.html.
   - Trang login.html (có form #admin-login-form): bấm đăng nhập là vào index.html (không kiểm tra tài khoản).
   - Nút "Đăng xuất" (.admin-logout): xóa phiên đăng nhập.
   Trạng thái đăng nhập lưu trong sessionStorage nên tự mất khi đóng tab.
   Lưu ý: đây chỉ là rào chắn giao diện; muốn bảo mật thật phải kiểm tra ở máy chủ. */
(function () {
  var SESSION_KEY = 'bookly_admin';
  var LOGIN_PAGE = 'login.html';
  var HOME_PAGE = 'index.html';

  function isLoggedIn() {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch (err) { return false; }
  }
  function setLoggedIn(on) {
    try {
      if (on) sessionStorage.setItem(SESSION_KEY, '1'); else sessionStorage.removeItem(SESSION_KEY);
      return true;
    } catch (err) { return false; }
  }

  /* ----- Trang quản trị: bắt buộc đã đăng nhập ----- */
  var root = document.documentElement;
  function guard() {
    if (isLoggedIn()) { root.style.visibility = ''; return; }
    root.style.visibility = 'hidden';            // không để lộ nội dung trong lúc chuyển trang
    location.replace(LOGIN_PAGE);
  }
  if (root.hasAttribute('data-admin-guard')) {
    guard();
    // Quay lui bằng nút Back sau khi đăng xuất: trang lấy từ bộ nhớ đệm, phải kiểm tra lại
    window.addEventListener('pageshow', function (e) { if (e.persisted) guard(); });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.admin-logout')) return;
      setLoggedIn(false);
    });
  }

  /* ----- Trang đăng nhập ----- */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('admin-login-form');
    if (!form) return;
    setLoggedIn(false);          // vào trang đăng nhập nghĩa là đăng xuất: luôn phải nhập lại tài khoản
    // Xóa mọi giá trị trình duyệt tự điền sẵn (mật khẩu đã lưu...) để người dùng phải tự nhập
    function clearFields() { form.reset(); form.elements.username.value = ''; form.elements.password.value = ''; }
    clearFields();
    setTimeout(clearFields, 300);
    window.addEventListener('pageshow', function (e) { if (e.persisted) { clearFields(); setLoggedIn(false); } });

    var error = document.getElementById('admin-login-error');
    function fail(msg) { error.textContent = msg; error.hidden = false; }

    form.addEventListener('input', function () { error.hidden = true; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Đăng nhập minh họa: nhập gì (kể cả để trống) cũng được vào.
      if (!setLoggedIn(true)) { fail('Trình duyệt đang chặn lưu phiên đăng nhập. Hãy bật lưu trữ cục bộ rồi thử lại.'); return; }
      location.replace(HOME_PAGE);
    });
  });
})();
