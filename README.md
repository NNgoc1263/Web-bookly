# BOOKLY – website bán sách (HTML/CSS/JS thuần)

Mở `index.html` để bắt đầu.

## Cấu trúc thư mục
```
index.html            Trang chủ cho khách (điểm vào)
pages/
  guest/              Trang cho khách chưa đăng nhập (danh mục, sách, liên hệ, đăng nhập/đăng ký)
  user/               Trang cho người dùng đã đăng nhập (trang chủ, giỏ hàng, thanh toán, đơn hàng, thông báo...)
  admin/              Khu quản trị: login.html, index.html (bảng điều khiển), order-detail.html
assets/
  css/                base.css (dùng chung) · site.css (website) · admin.css (quản trị)
  js/                 flash, pagination, search, stepper, cart, product, checkout (website)
  js/admin/           auth (đăng nhập), data (dữ liệu minh họa đơn hàng), dashboard (form sản phẩm/khách hàng, tìm/thống kê giả lập), order-detail
  images/             Ảnh sách, logo, banner
```

## Quản trị
Vào `pages/admin/login.html` và bấm đăng nhập (chế độ minh họa: không cần nhập gì cũng vào được; muốn bắt buộc tài khoản thì sửa lại phần `submit` trong `assets/js/admin/auth.js`).

## Sản phẩm
- 24 sách đang bán trên website (mỗi thể loại 4 sách): trang chi tiết là `pages/{guest,user}/product.html` (SP001) và `product-N.html` (SP00N / SP0NN). `product-9` không có vì SP009 (Truyện cổ Grimm) chưa đăng bán, chỉ xuất hiện ở trang quản trị. Ảnh bìa: `assets/images/product-itemN.png`.
- Trang danh mục: bấm một thể loại để xem 4 sách của thể loại đó. Phân trang chỉ để minh họa (số trang tính theo tổng 10.888 sản phẩm ở trang quản trị); bấm số trang chỉ đổi nút sáng, không đổi nội dung.
- Trang quản trị liệt kê 25 sản phẩm (24 đang bán + 1 chưa đăng bán), phân trang thật: mỗi trang 5 sách, 5 trang (số nút trang tự tính theo số dòng trong bảng; xem `assets/js/admin/dashboard.js`). Các phân trang khác ở khu quản trị và trang danh mục vẫn chỉ minh họa.
- Form sản phẩm ở trang quản trị có đủ các trường như trang chi tiết bên web: tên, thể loại, mã, tác giả, nhà xuất bản, năm xuất bản, hình thức, số trang, kích thước, ngôn ngữ, giá, số lượng (hiện thành "Còn hàng (N cuốn)"), trạng thái, điểm nổi bật, mô tả (2 đoạn), "Phù hợp với". Sửa nội dung một sách thì sửa ở cả hai nơi: `data-*` của nút "Sửa" trong `pages/admin/index.html` và `pages/{guest,user}/product-N.html`.
- Ô tìm sách, nút "Thống kê" (Top 5 khách hàng) và ô tìm khách hàng ở trang quản trị đều chỉ giả lập: bấm là trang nhảy lại đúng mục đó, không tìm/tính thật. Bấm "Xem" ở từng khách trong Top 5 để xem các đơn, bấm tiếp vào đơn để mở chi tiết.
- Chi tiết đơn hàng (admin): admin xử lý đơn ngay trong trang (Chờ xác nhận → Xác nhận / Hủy; Đã xác nhận → Giao hàng / Hủy; Đang giao → Đã giao). Trạng thái chỉ đổi trên trang đó (minh họa), tải lại sẽ về ban đầu.
- Trang chi tiết sách (web): khung thông tin nhanh chỉ giữ mã, nhà xuất bản, năm xuất bản, tình trạng; hình thức, số trang, kích thước, ngôn ngữ nằm ở tab "Thông tin chi tiết" (tách đúng như các ô nhập bên admin).
