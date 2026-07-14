# GreenPoro 🌿 — Pomodoro & Task Manager

**GreenPoro** là một ứng dụng quản lý thời gian Pomodoro kết hợp danh sách công việc (Task Manager) tối giản, hiện đại và tinh tế. Được thiết kế với gam màu xanh lục dịu mắt (Soft Sage Green) kết hợp cùng hiệu ứng chuyển động mượt mà, GreenPoro mang lại trải nghiệm tập trung tối đa, giúp bạn quản lý công việc và cân bằng thời gian nghỉ ngơi hiệu quả ngay trên trình duyệt.

👉 **Trải nghiệm trực tuyến (Demo):** [https://nam101nam.github.io/GreenPoro/](https://nam101nam.github.io/GreenPoro/)

---

## 💡 Ý tưởng & Nguyên nhân ra đời

**GreenPoro** được lấy cảm hứng và phát triển dựa trên trang web [Pomofocus.io](https://pomofocus.io/). Nhận thấy một số điểm có thể tối ưu hơn từ phiên bản gốc, GreenPoro đã được xây dựng nhằm tích hợp thêm các công cụ hỗ trợ mạnh mẽ, giúp nâng cao động lực và theo dõi tiến trình làm việc lâu dài như:
- Tích hợp **Focus Journey** (Bản đồ đóng góp nhiệt huyết tương tự GitHub) giúp lưu trữ lịch sử và tần suất tập trung.
- Biểu đồ **Weekly Summary** trực quan hóa thời gian học tập thực tế mỗi ngày trong tuần.
- Hệ thống **Thành tựu (Achievements)** tăng tính tương tác và động lực hoàn thành mục tiêu.
- Trình quản lý công việc linh hoạt hỗ trợ phân loại danh sách việc chưa làm và đã làm, chỉnh sửa tiêu đề trực tiếp bằng thao tác đúp chuột.
- Trình phát nhạc hỗ trợ linh hoạt cả **YouTube IFrame API** lẫn luồng âm thanh trực tiếp (Direct MP3).

---

## 📸 Giao diện ứng dụng

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🌿 Focus Journey                               │  🌿 GreenPoro                   ⚙️   │
│                                                 ├──────────────────────────────────────┤
│  Total Pomo  |  Day Streak  |  Active Days      │               Pomodoro               │
│      12            3              5             │                25:00                 │
│                                                 │            [ START ] [▶]             │
│  [■][■][ ][ ]... (Calendar Grid)                │                                      │
│                                                 │     Active Task: Lập trình dự án     │
│  📊 Weekly Summary                              ├──────────────────────────────────────┤
│  █ █ █ ▄ █ _ _ (Mon-Sun chart)                  │  🎵 Sleepy Cat (Lofi)     [▶] [Input]│
│                                                 ├──────────────────────────────────────┤
│  🏆 Achievements                                │  Today's Cycles: 0 | Focus: 0 mins   │
│  [🎯] [🔥] [🌿] [Locked] [Locked]               │  [=================================] │
│                                                 ├──────────────────────────────────────┤
│                                                 │  Tasks (1)                           │
│                                                 │  [+] Add new task...                 │
│                                                 │  ▼ To-Do (1)                         │
│                                                 │    [ ] Lập trình dự án               │
│                                                 │  ▶ Completed (0)                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Tính năng nổi bật

### 1. Đồng hồ Pomodoro chuẩn xác
* **3 Chế độ linh hoạt:** Tập trung (Pomodoro), Nghỉ ngắn (Short Break), và Nghỉ dài (Long Break) với tab chuyển đổi mượt mà.
* **Đếm ngược chính xác:** Sử dụng cơ chế mốc thời gian đích (`endTime = Date.now() + timeLeft`) giúp chống trôi giây khi trình duyệt chạy ẩn hoặc bị bóp hiệu năng (throttle).
* **Đồng bộ Tiêu đề:** Hiển thị thời gian còn lại trực tiếp trên tiêu đề tab trình duyệt để tiện theo dõi.

### 2. Bản đồ tập trung (Focus Journey)
* **Contribution Calendar:** Hiển thị biểu đồ nhiệt (Heatmap) 371 ngày gần nhất (52 tuần) tương tự GitHub để theo dõi tần suất hoàn thành Pomodoro.
* **Chỉ số Động lực:** 
  * **Total Pomo:** Tổng số chu kỳ Pomodoro đã hoàn thành từ trước đến nay.
  * **Day Streak:** Số ngày liên tục duy trì thói quen tập trung (tự động phát hiện đứt chuỗi).
  * **Active Days:** Tổng số ngày có ít nhất một chu kỳ Pomodoro hoàn thành.
* **Chú giải & Tooltip:** Hiển thị thông tin chi tiết (số Pomodoro, ngày cụ thể) khi rê chuột qua từng ô lịch.

### 3. Thống kê hiệu suất tuần (Weekly Summary)
* Biểu đồ cột tự động co giãn theo số phút tập trung tích lũy từ Thứ Hai đến Chủ Nhật của tuần hiện tại.
* Làm nổi bật các ngày tập trung cao độ (>= 100 phút) với tông màu tối đậm hơn.

### 4. Hệ thống thành tựu (Achievements)
* Tự động mở khóa các danh hiệu khi đạt các cột mốc tương ứng:
  * 🎯 **First Step**: Hoàn thành 1 Pomodoro đầu tiên.
  * 🔥 **Streak Starter**: Đạt chuỗi 3 ngày tập trung liên tiếp.
  * 🌿 **Consistency**: Tập trung vào 3 ngày khác nhau.
  * ⭐ **Focus Master**: Tích lũy đủ 10 Pomodoro.
  * 🏆 **Super Day**: Hoàn thành xuất sắc 4 Pomodoro trong cùng một ngày.

### 5. Quản lý công việc thông minh (Task Manager)
* **Phân loại trạng thái:** Tách biệt công việc chưa làm (To-Do) và đã hoàn thành (Completed) thành hai danh sách có thể đóng/mở (collapsible).
* **Active Task:** Chọn một công việc làm trọng tâm hiện tại để ghim trực tiếp dưới đồng hồ.
* **Chỉnh sửa nhanh:** Đúp chuột (double-click) vào tiêu đề để sửa tên công việc ngay tại chỗ (nhấn Enter/Blur để lưu hoặc Escape để hủy).

### 6. Trình phát nhạc nền đa dụng (Dual Media Mode)
* Hỗ trợ phát nhạc nền tự động hoặc thủ công từ hai nguồn:
  * **YouTube Video:** Nhập link YouTube/Video ID, tự động điều khiển qua YouTube IFrame Player API và lấy tiêu đề video thực tế.
  * **Direct Audio:** Nhập link trực tiếp (file `.mp3` hoặc luồng stream trực tiếp), tự động giải mã tiêu đề từ URL.
* Cài đặt liên kết phát nhạc riêng biệt cho từng chế độ (Focus / Short Break / Long Break).

### 7. Âm báo hiệu tổng hợp (Web Audio API)
* Tự động phát âm thanh thông báo nhẹ nhàng dạng arpeggio đô trưởng (chime gồm 4 nốt liên tiếp C5 - E5 - G5 - C6) khi kết thúc mỗi chu kỳ.
* Tổng hợp tần số âm thanh hoàn toàn bằng code (Web Audio API) giúp ứng dụng không cần tải các file `.mp3` ngoại vi, loại bỏ lỗi mạng hoặc lỗi tải file.

### 8. Bảng cài đặt & Lưu trữ cục bộ (LocalStorage)
* Cấu hình linh hoạt thời gian cho từng chế độ, khoảng cách nghỉ dài (Long Break Interval), bật tắt tự động phát nhạc và âm báo kết thúc.
* Tự động lưu mọi cấu hình, danh sách công việc, lịch sử hàng ngày vào `localStorage` của trình duyệt.

---

## 🛠️ Công nghệ sử dụng

GreenPoro sử dụng bộ công nghệ web thuần túy (**Vanilla Tech Stack**) giúp ứng dụng tải trang tức thì, vận hành mượt mà và không cần cài đặt phức tạp:
1. **HTML5:** Cấu trúc tài liệu ngữ nghĩa (Semantic HTML), hỗ trợ SEO và tương thích tốt.
2. **CSS3:** Thiết kế Responsive thích ứng trên mọi kích thước màn hình (Mobile, Tablet, Desktop), định nghĩa hệ thống màu tùy biến qua CSS Variables và hiệu ứng chuyển động mượt mà.
3. **Vanilla JavaScript (ES6):** Xử lý toàn bộ logic ứng dụng, đếm ngược thời gian thực, quản lý trạng thái, xử lý sự kiện DOM.
4. **YouTube IFrame Player API:** Tích hợp và điều khiển trình phát video YouTube ẩn dưới dạng nhạc nền.
5. **Web Audio API:** Tổng hợp sóng sin tạo âm thanh thông báo chime chất lượng cao.
6. **Web Storage API (localStorage):** Lưu trữ dữ liệu lâu dài trên trình duyệt của người dùng.

---

## 📂 Cấu trúc thư mục

```text
GreenPoro/
├── index.html       # Cấu trúc giao diện ứng dụng, Sidebar và các Modals cài đặt
├── style.css        # Định nghĩa kiểu dáng giao diện, hệ thống CSS Variables và Responsive
├── app.js           # Logic cốt lõi: xử lý đồng hồ, danh sách task, thống kê, âm thanh và nhạc nền
├── .gitignore       # Cấu hình bỏ qua các tệp không cần thiết khi đẩy lên Git
└── README.md        # Tài liệu hướng dẫn sử dụng và giới thiệu dự án (tệp này)
```

---

## 🚀 Hướng dẫn chạy dự án

Do ứng dụng được phát triển hoàn toàn bằng công nghệ Frontend tĩnh (Static Frontend), bạn có thể chạy dự án rất dễ dàng bằng một trong các cách sau:

### Cách 1: Mở trực tiếp bằng trình duyệt
1. Tải toàn bộ mã nguồn của dự án về máy tính.
2. Nhấp đúp chuột vào tệp `index.html` để mở ứng dụng trực tiếp bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari...).

### Cách 2: Sử dụng Live Server (Khuyên dùng)
Nếu sử dụng VS Code, bạn có thể cài đặt extension **Live Server**:
1. Mở thư mục dự án trên VS Code.
2. Click chuột phải vào tệp `index.html` và chọn **Open with Live Server**.
3. Ứng dụng sẽ chạy tại địa chỉ mặc định `http://127.0.0.1:5500`.

---

## 🤝 Đóng góp ý kiến (Contributing)

Mọi ý kiến đóng góp và cải thiện chất lượng ứng dụng đều được chào đón! Bạn có thể đề xuất tính năng mới hoặc báo lỗi bằng cách:
1. Fork dự án này.
2. Tạo một nhánh mới (`git checkout -b feature/AmazingFeature`).
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên nhánh vừa tạo (`git push origin feature/AmazingFeature`).
5. Tạo một **Pull Request** trên GitHub để cùng thảo luận.

---

## 📄 Bản quyền (License)

Dự án được phân phối theo giấy phép **MIT License**. Bạn có toàn quyền sử dụng, chỉnh sửa và phân phối lại cho mục đích cá nhân hoặc thương mại.

---

*Chúc bạn có những giờ phút làm việc và học tập thật năng suất cùng **GreenPoro 🌿**!*

