/* Dữ liệu minh họa dùng chung cho khu vực quản trị (đơn hàng, giá sách, trạng thái).
   Được nạp bởi pages/admin/order-detail.html (chi tiết đơn).
   Đường dẫn ảnh tính từ thư mục pages/admin/. */
var BOOKLY = (function () {
  var ORDERS = {
  "DH1030": { name: "Võ Minh Khang", phone: "0987 120 453", addr: "45 Huỳnh Tấn Phát, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh", date: "06/10/2026", status: "wait", pay: "cod", discount: 0,
    items: [["Cây tre trăm đốt", 1], ["Đắc nhân tâm", 1]] },
  "DH1029": { name: "Lê Ngọc Mai", phone: "0975 410 236", addr: "88 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh", date: "05/10/2026", status: "wait", pay: "online", discount: 0,
    items: [["Lược sử về loài người", 1], ["Doraemon", 1], ["Đắc nhân tâm", 1]] },
  "DH1028": { name: "Phạm Gia Hân", phone: "0903 667 815", addr: "27 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh", date: "05/10/2026", status: "confirm", pay: "cod", discount: 0,
    items: [["Tội Ác Và Hình Phạt", 1]] },
  "DH1027": { name: "Đặng Thu Hà", phone: "0966 358 072", addr: "156 Ba Tháng Hai, Phường 12, Quận 10, TP. Hồ Chí Minh", date: "04/10/2026", status: "ship", pay: "cod", discount: 0,
    items: [["Sherlock Holmes", 1], ["Cây tre trăm đốt", 1]] },
  "DH1026": { name: "Hoàng Lan Chi", phone: "0944 513 927", addr: "63 Quang Trung, Phường 10, Quận Gò Vấp, TP. Hồ Chí Minh", date: "03/10/2026", status: "cancel", pay: "cod", discount: 0,
    items: [["Doraemon", 1]] },
  "DH1025": { name: "Trần Hoàng Nam", phone: "0938 221 904", addr: "210 Võ Văn Tần, Phường 5, Quận 3, TP. Hồ Chí Minh", date: "03/10/2026", status: "ship", pay: "online", discount: 0,
    items: [["Điện Biên Phủ", 1], ["Lược sử về loài người", 1], ["Nhà Giả Kim", 1], ["Đắc nhân tâm", 1]] },
  "DH1024": { name: "Nguyễn Minh Anh", phone: "0912 345 678", addr: "12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh", date: "02/10/2026", status: "confirm", pay: "cod", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Sherlock Holmes", 1]] },
  "DH1023": { name: "Trần Hoàng Nam", phone: "0938 221 904", addr: "210 Võ Văn Tần, Phường 5, Quận 3, TP. Hồ Chí Minh", date: "01/10/2026", status: "done", pay: "cod", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Tội Ác Và Hình Phạt", 1]] },
  "DH1018": { name: "Nguyễn Minh Anh", phone: "0912 345 678", addr: "12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh", date: "25/09/2026", status: "done", pay: "cod", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Cây tre trăm đốt", 1], ["Sherlock Holmes", 1], ["Đắc nhân tâm", 1]] },
  "DH1012": { name: "Nguyễn Minh Anh", phone: "0912 345 678", addr: "12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh", date: "20/09/2026", status: "done", pay: "online", discount: 5000,
    items: [["Nhà Giả Kim", 1], ["Cây tre trăm đốt", 1], ["Sherlock Holmes", 1], ["Điện Biên Phủ", 1]] },
  "DH1005": { name: "Nguyễn Minh Anh", phone: "0912 345 678", addr: "12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh", date: "10/09/2026", status: "done", pay: "cod", discount: 0,
    items: [["Cây tre trăm đốt", 1], ["Điện Biên Phủ", 2], ["Lược sử về loài người", 1], ["Đắc nhân tâm", 1]] },
  "DH1020": { name: "Trần Hoàng Nam", phone: "0938 221 904", addr: "210 Võ Văn Tần, Phường 5, Quận 3, TP. Hồ Chí Minh", date: "30/09/2026", status: "done", pay: "online", discount: 0,
    items: [["Điện Biên Phủ", 1], ["Lược sử về loài người", 2], ["Đắc nhân tâm", 1]] },
  "DH1014": { name: "Trần Hoàng Nam", phone: "0938 221 904", addr: "210 Võ Văn Tần, Phường 5, Quận 3, TP. Hồ Chí Minh", date: "22/09/2026", status: "done", pay: "cod", discount: 0,
    items: [["Doraemon", 1], ["Lược sử về loài người", 2]] },
  "DH1007": { name: "Trần Hoàng Nam", phone: "0938 221 904", addr: "210 Võ Văn Tần, Phường 5, Quận 3, TP. Hồ Chí Minh", date: "12/09/2026", status: "done", pay: "cod", discount: 20000,
    items: [["Nhà Giả Kim", 1], ["Doraemon", 1], ["Đắc nhân tâm", 1]] },
  "DH1016": { name: "Lê Ngọc Mai", phone: "0975 410 236", addr: "88 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh", date: "25/09/2026", status: "done", pay: "online", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Sherlock Holmes", 1], ["Lược sử về loài người", 1], ["Tội Ác Và Hình Phạt", 1], ["Đắc nhân tâm", 1]] },
  "DH1010": { name: "Lê Ngọc Mai", phone: "0975 410 236", addr: "88 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh", date: "17/09/2026", status: "done", pay: "cod", discount: 0,
    items: [["Sherlock Holmes", 1], ["Lược sử về loài người", 1], ["Đắc nhân tâm", 1]] },
  "DH1019": { name: "Phạm Gia Hân", phone: "0903 667 815", addr: "27 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh", date: "29/09/2026", status: "done", pay: "cod", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Sherlock Holmes", 1], ["Điện Biên Phủ", 1], ["Đắc nhân tâm", 1]] },
  "DH1008": { name: "Phạm Gia Hân", phone: "0903 667 815", addr: "27 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh", date: "14/09/2026", status: "done", pay: "online", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Sherlock Holmes", 1], ["Đắc nhân tâm", 1]] },
  "DH1013": { name: "Võ Minh Khang", phone: "0987 120 453", addr: "45 Huỳnh Tấn Phát, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh", date: "21/09/2026", status: "done", pay: "cod", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Doraemon", 1], ["Điện Biên Phủ", 1]] },
  "DH1003": { name: "Võ Minh Khang", phone: "0987 120 453", addr: "45 Huỳnh Tấn Phát, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh", date: "06/09/2026", status: "done", pay: "cod", discount: 10000,
    items: [["Doraemon", 1], ["Tội Ác Và Hình Phạt", 1], ["Đắc nhân tâm", 1]] },
  "DH1002": { name: "Nguyễn Minh Anh", phone: "0912 345 678", addr: "12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh", date: "03/09/2026", status: "cancel", pay: "cod", discount: 0,
    items: [["Nhà Giả Kim", 1], ["Đắc nhân tâm", 1]] }
  };

  /* Tên sách -> [giá, ảnh bìa] */
  var BOOKS = {
    'Nhà Giả Kim': [68000, '../../assets/images/product-item1.png'],
    'Cây tre trăm đốt': [79000, '../../assets/images/product-item2.png'],
    'Sherlock Holmes': [95000, '../../assets/images/product-item3.png'],
    'Doraemon': [55000, '../../assets/images/product-item4.png'],
    'Điện Biên Phủ': [145000, '../../assets/images/product-item5.png'],
    'Lược sử về loài người': [135000, '../../assets/images/product-item6.png'],
    'Tội Ác Và Hình Phạt': [88000, '../../assets/images/product-item7.png'],
    'Đắc nhân tâm': [52000, '../../assets/images/product-item8.png'],
    'Pháp y Tần Minh 1': [149000, '../../assets/images/product-item10.png'],
    'Tiếng nói tử thi': [135000, '../../assets/images/product-item11.png'],
    'Tội lỗi không chứng cứ': [139000, '../../assets/images/product-item12.png'],
    'Hoa vẫn nở mỗi ngày': [169000, '../../assets/images/product-item13.png'],
    'Hai số phận': [139000, '../../assets/images/product-item14.png'],
    'Con Rồng cháu Tiên': [68000, '../../assets/images/product-item15.png'],
    'Thánh Gióng': [45000, '../../assets/images/product-item16.png'],
    'Cô Bé Quàng Khăn Đỏ': [65000, '../../assets/images/product-item17.png'],
    'Thỏ Bảy Màu': [79000, '../../assets/images/product-item18.png'],
    'Thám tử lừng danh Conan 18': [30000, '../../assets/images/product-item19.png'],
    'Shin - Cậu bé bút chì 14': [30000, '../../assets/images/product-item20.png'],
    'Lịch sử Việt Nam - Tập 8': [265000, '../../assets/images/product-item21.png'],
    'Đinh Bộ Lĩnh': [45000, '../../assets/images/product-item22.png'],
    'Think and Grow Rich': [119000, '../../assets/images/product-item23.png'],
    'Trò chơi tư duy (Thinkertoys)': [135000, '../../assets/images/product-item24.png'],
    'Trò chơi của những kẻ hiểu luật': [129000, '../../assets/images/product-item25.png']
  };
  var STATUS = { wait: 'Chờ xác nhận', confirm: 'Đã xác nhận', ship: 'Đang giao', done: 'Đã giao', cancel: 'Đã hủy' };
  var SHIP = 30000;

  /* Tổng tiền của một đơn: tiền sách + phí giao - giảm giá */
  function orderTotal(o) {
    var sum = 0;
    o.items.forEach(function (it) { sum += BOOKS[it[0]][0] * it[1]; });
    return sum + SHIP - o.discount;
  }

  return { ORDERS: ORDERS, BOOKS: BOOKS, STATUS: STATUS, SHIP: SHIP, orderTotal: orderTotal };
})();
