/* Trang quản trị (pages/admin/index.html), chỉ minh họa giao diện: bấm "Sửa" thì điền sẵn thông tin của mục đó, bấm "Thêm" thì để trống.
   Ô tìm sách, nút "Thống kê" và ô tìm khách hàng đều là form gửi về chính mục đó: bấm là trang nhảy lại mục ấy, không tìm hay tính thật. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var coverImg = $('pf-cover-img'), coverEmpty = $('pf-cover-empty');
  function setCover(src, alt) {
    coverImg.hidden = !src; coverEmpty.hidden = !!src;
    if (src) { coverImg.src = src; coverImg.alt = alt || 'Ảnh bìa sách'; }
  }
  /* Chọn ảnh từ máy: xem trước ngay trong khung ảnh bìa. */
  $('pf-file').addEventListener('change', function () {
    var f = this.files && this.files[0];
    if (f) setCover(URL.createObjectURL(f), 'Ảnh bìa mới');
  });
  /* Top 5 khách hàng: bấm "Xem" để sổ ra các đơn của khách. */
  document.addEventListener('click', function (e) {
    var tg = e.target.closest('[data-top-toggle]');
    if (!tg) return;
    var open = tg.getAttribute('aria-expanded') !== 'true';
    tg.setAttribute('aria-expanded', String(open));
    tg.textContent = open ? 'Ẩn' : 'Xem';
    document.querySelectorAll('tr[data-group="' + tg.dataset.topToggle + '"]').forEach(function (r) { r.hidden = !open; });
  });
  /* Giá, số lượng, số trang không được nhỏ hơn 0: chặn gõ dấu "-", và tự đưa về 0 nếu dán/nhập số âm. */
  ['pf-price', 'pf-qty', 'pf-pages'].forEach(function (id) {
    var inp = $(id);
    inp.addEventListener('keydown', function (e) {
      if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') e.preventDefault();
    });
    inp.addEventListener('input', function () {
      if (inp.value !== '' && Number(inp.value) < 0) inp.value = 0;
    });
  });
  /* Xóa sản phẩm (chỉ minh họa giao diện): bấm "Xóa" ở dòng -> hộp hỏi xác nhận; bấm "Xóa" trong hộp ->
     chỉ hiện thông báo "Đã xóa" rồi đóng hộp. Dòng sản phẩm vẫn nằm nguyên trong bảng, không xóa gì cả. */
  var openBox = null;
  function closeBox() { if (openBox) { openBox.classList.remove('open'); openBox = null; } }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });
  document.addEventListener('click', function (e) {
    var ask = e.target.closest('a[href^="#confirm-del-"]');
    if (ask) {
      var box = $(ask.getAttribute('href').slice(1));
      if (!box) return;
      e.preventDefault();                 // không đổi URL, nên không bị kẹt hộp thoại khi quay lại/tải lại
      closeBox(); box.classList.add('open'); openBox = box;
      return;
    }
    var okBtn = e.target.closest('.confirm-box a[href^="#deleted-"]');
    if (okBtn) {
      closeBox();                         // flash.js đã hiện thông báo "Đã xóa sản phẩm thành công"; dòng sản phẩm giữ nguyên
      return;
    }
    if (e.target.closest('.confirm-box a[href="#products"]')) { e.preventDefault(); closeBox(); return; }   // Hủy
    if (e.target.classList && e.target.classList.contains('confirm-box')) closeBox();                       // bấm nền mờ
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-edit], a[data-add]');
    if (!a) return;
    if (a.dataset.add === 'product' || a.dataset.edit === 'product') {
      $('product-edit-form').reset();
      if (a.dataset.edit) {
        $('pf-title').textContent = 'Sửa sản phẩm ' + a.dataset.code;
        $('pf-code').value = a.dataset.code;
        $('pf-name').value = a.dataset.name;
        $('pf-author').value = a.dataset.author;
        $('pf-pub').value = a.dataset.pub;
        $('pf-year').value = a.dataset.pubyear;
        $('pf-binding').value = a.dataset.binding;
        $('pf-pages').value = a.dataset.pages;
        $('pf-size').value = a.dataset.size;
        $('pf-lang').value = a.dataset.lang;
        $('pf-cat').value = a.dataset.cat;
        $('pf-price').value = a.dataset.price;
        $('pf-qty').value = a.dataset.qty;
        $('pf-status').value = a.dataset.status;
        $('pf-hl').value = a.dataset.hl;
        $('pf-desc').value = a.dataset.desc;
        $('pf-desc2').value = a.dataset.desc2;
        $('pf-fit').value = a.dataset.fit;
        setCover(a.dataset.img, 'Bìa sách ' + a.dataset.name);   // Sửa: hiện ảnh bìa hiện tại của sách đó
      } else {
        $('pf-title').textContent = 'Thêm sản phẩm';
        setCover('');                      // Thêm mới: khung ảnh bìa để trống
      }
    } else {
      $('customer-edit-form').reset();
      if (a.dataset.edit) {
        $('cf-title').textContent = 'Sửa khách hàng ' + a.dataset.code;
        $('cf-name').value = a.dataset.name;
        $('cf-email').value = a.dataset.email;
        $('cf-phone').value = a.dataset.phone;
        $('cf-status').value = a.dataset.status;
      } else {
        $('cf-title').textContent = 'Thêm khách hàng';
      }
    }
  });
})();
