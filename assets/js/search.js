/* Tìm kiếm nâng cao + lọc sách theo thể loại (chạy ở mọi trang có ô tìm kiếm).
   - Ô tìm kiếm nhanh: tìm theo tên sách hoặc tác giả.
   - "Tìm kiếm nâng cao": bấm vào tiêu đề để mở/đóng (không còn tự mở khi bấm vào ô tìm kiếm).
   - Trang danh mục (pages/guest/category.html và pages/user/category.html): đọc tham số trên URL và lọc danh sách sách,
     ví dụ  category.html?category=Lịch sử  hoặc  ?title=Nhà Giả Kim&minPrice=50000 */
(function () {
  var FIELDS = ['q', 'title', 'author', 'year', 'category', 'sort', 'minPrice', 'maxPrice', 's'];

  /* Bỏ dấu + chữ thường để tìm "nha gia kim" vẫn ra "Nhà Giả Kim". */
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
  }
  function money(n) { return Number(n).toLocaleString('vi-VN') + ' ₫'; }

  var params = new URLSearchParams(location.search);
  var P = {};
  FIELDS.forEach(function (k) { P[k] = (params.get(k) || '').trim(); });

  /* ---------- 1. Form tìm kiếm trên thanh đầu trang ---------- */
  document.querySelectorAll('form.search-wrap').forEach(function (form) {
    var details = form.querySelector('details.adv-search');

    // Điền lại điều kiện đang tìm (khi đang ở trang kết quả)
    FIELDS.forEach(function (k) {
      var el = form.elements[k];
      if (el && P[k] !== '') el.value = P[k];
    });

    // Gửi form: chỉ đưa các điều kiện có nhập vào URL cho gọn
    form.addEventListener('submit', function (e) {
      var min = form.elements.minPrice, max = form.elements.maxPrice;
      if (min && max) {
        max.setCustomValidity(min.value !== '' && max.value !== '' && Number(min.value) > Number(max.value)
          ? 'Giá đến phải lớn hơn hoặc bằng giá từ.' : '');
        if (!max.checkValidity()) {
          e.preventDefault();
          if (details) details.open = true;
          max.reportValidity();
          return;
        }
      }
      e.preventDefault();
      var qs = new URLSearchParams();
      FIELDS.forEach(function (k) {
        var el = form.elements[k];
        if (el && el.value.trim() !== '') qs.set(k, el.value.trim());
      });
      if (qs.toString()) qs.set('s', '1');   // đánh dấu: kết quả tìm kiếm (minh họa)
      var s = qs.toString();
      location.href = form.getAttribute('action') + (s ? '?' + s : '');
    });
    if (form.elements.maxPrice) {
      ['minPrice', 'maxPrice'].forEach(function (k) {
        form.elements[k].addEventListener('input', function () { form.elements.maxPrice.setCustomValidity(''); });
      });
    }

    // "Xóa nội dung tìm kiếm": xóa sạch mọi ô đã nhập/chọn
    var clear = form.querySelector('[data-adv-clear]');
    if (clear) clear.addEventListener('click', function () {
      FIELDS.forEach(function (k) {
        var el = form.elements[k];
        if (!el) return;
        if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = '';
        if (el.setCustomValidity) el.setCustomValidity('');
      });
      var first = form.elements.title;
      if (first) first.focus();
    });
  });

  // Bấm ra ngoài hoặc nhấn Esc thì thu gọn bảng nâng cao
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.adv-search[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.open = false;
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('details.adv-search[open]').forEach(function (d) { d.open = false; });
  });

  /* ---------- 2. Lọc danh sách sách ở trang danh mục ---------- */
  var list = document.querySelector('.products');
  var cards = list ? Array.prototype.slice.call(list.querySelectorAll(':scope > .card[data-cat]')) : [];
  if (!cards.length) return;

  var active = FIELDS.some(function (k) { return P[k] !== ''; });
  var min = P.minPrice !== '' ? Number(P.minPrice) : null;
  var max = P.maxPrice !== '' ? Number(P.maxPrice) : null;
  var q = norm(P.q), title = norm(P.title), author = norm(P.author), cat = norm(P.category);

  // Thanh danh mục: đánh dấu thể loại đang xem
  document.querySelectorAll('.category-browser a').forEach(function (a) {
    var c = new URL(a.href, location.href).searchParams.get('category');
    if (c && norm(c) === cat && cat) a.setAttribute('aria-current', 'page');
  });

  /* Phân trang minh họa: cửa hàng có hàng nghìn đầu sách, mỗi trang thể loại hiện 4 sách.
     Số sách mỗi thể loại cộng lại bằng tổng sản phẩm ở trang quản trị (10.888). */
  var CAT_BOOKS = { 'tieu thuyet': 2412, 'co tich': 1356, 'trinh tham': 1680, 'truyen tranh': 2260, 'lich su': 1544, 'phat trien ban than': 1636 };
  var PER_CAT_PAGE = 4;
  function setLastPage(pager, last) {
    var lastLink = pager && pager.querySelector('.dots + a');
    if (lastLink) lastLink.textContent = last;
  }

  if (!active) return;

  /* Tìm kiếm chỉ minh họa: không lọc thật. Kết quả luôn là một trang duy nhất gồm các sách của trang danh mục.
     Chỉ khi bấm một thể loại (chỉ có ?category=...) mới hiện đúng sách của thể loại đó. */
  var onlyCat = P.category !== '' && FIELDS.every(function (k) { return k === 'category' || P[k] === ''; });
  var found = 0;
  cards.forEach(function (card) {
    // Minh họa: bấm một thể loại thì hiện sách của thể loại đó; tìm kiếm bất kỳ luôn chỉ ra đúng sách Nhà Giả Kim.
    var ok = onlyCat ? norm(card.dataset.cat) === cat : norm(card.dataset.title) === 'nha gia kim';
    card.hidden = !ok;
    if (ok) found++;
  });

  // Tiêu đề + dòng tóm tắt kết quả
  var head = document.querySelector('#all-products h2');
  if (head) head.textContent = onlyCat ? 'Thể loại: ' + P.category : 'Kết quả tìm kiếm';

  var chips = [];
  if (P.q) chips.push('“' + P.q + '”');
  if (P.title) chips.push('Tên sách: ' + P.title);
  if (P.author) chips.push('Tác giả: ' + P.author);
  if (P.year) chips.push('Năm: ' + P.year);
  if (P.category && !onlyCat) chips.push('Thể loại: ' + P.category);
  if (min !== null || max !== null) {
    chips.push('Giá: ' + (min !== null ? money(min) : '0 ₫') + (max !== null ? ' – ' + money(max) : ' trở lên'));
  }
  if (P.sort) chips.push(P.sort === 'asc' ? 'Giá tăng dần' : 'Giá giảm dần');

  var sum = document.createElement('p');
  sum.className = 'search-summary';
  var strong = document.createElement('b');
  strong.textContent = 'Tìm thấy ' + (onlyCat && CAT_BOOKS[cat] ? CAT_BOOKS[cat].toLocaleString('vi-VN') : found) + ' sách';
  sum.appendChild(strong);
  if (chips.length && !onlyCat) sum.appendChild(document.createTextNode(' · ' + chips.join(' · ')));
  var reset = document.createElement('a');
  reset.href = location.pathname.split('/').pop();
  reset.textContent = 'Xóa bộ lọc';
  sum.appendChild(reset);
  var holder = document.getElementById('all-products');
  if (holder) holder.parentNode.insertBefore(sum, holder.nextSibling);

  // Ẩn phần không cần khi đang xem kết quả
  var groups = document.querySelector('.category-groups');
  if (groups) groups.hidden = true;
  var pager = document.querySelector('.container > .pagination');
  var total = onlyCat ? CAT_BOOKS[cat] : 0;   // thể loại có sẵn trong CAT_BOOKS thì mới hiện phân trang
  if (pager) {
    if (total) { setLastPage(pager, Math.ceil(total / PER_CAT_PAGE)); pager.hidden = false; }
    else pager.hidden = true;
  }
  var none = document.querySelector('.no-search-results');
  if (none) none.hidden = found !== 0;
})();
