# GreenPoro 🌿 — Pomodoro & Task Manager

**GreenPoro** là một ứng dụng quản lý thời gian Pomodoro và danh sách công việc (Task Manager) tối giản, hiện đại và tinh tế. Được thiết kế với gam màu xanh lục dịu mắt (Soft Sage Green) kết hợp cùng hiệu ứng chuyển động mượt mà, GreenPoro mang lại trải nghiệm tập trung tối đa, giúp bạn quản lý công việc và cân bằng thời gian nghỉ ngơi hiệu quả ngay trên trình duyệt.

👉 **Trải nghiệm trực tuyến (Demo):** [https://nam101nam.github.io/GreenPoro/](https://nam101nam.github.io/GreenPoro/)

---

## 💡 Ý tưởng & Nguyên nhân ra đời

**GreenPoro** được lấy cảm hứng và phát triển dựa trên trang web [Pomofocus.io](https://pomofocus.io/). Khi sử dụng trang web đó, tác giả nhận thấy một số hạn chế:
- Chỉ có đồng hồ bấm giờ với thời gian học và thời gian nghỉ cố định.
- Không lưu lại lịch sử hay thời gian làm việc thực tế.
- Không tích hợp sẵn nhạc nền tập trung.
- Không tích hợp danh sách công việc (To-do list) để quản lý trực tiếp.

Chính vì vậy, **GreenPoro** đã được phát triển để tích hợp đầy đủ các tính năng này, mang lại trải nghiệm tiện lợi và tập trung nhất cho bạn.

---

## 📸 Giao diện ứng dụng

*Gợi ý: Bạn có thể chụp ảnh màn hình dự án và lưu vào thư mục `assets/` rồi cập nhật liên kết dưới đây.*
```
┌──────────────────────────────────────────────────┐
│  🌿 GreenPoro                                ⚙️   │
├──────────────────────────────────────────────────┤
│                   Pomodoro                       │
│                    25:00                         │
│                 [ START ] [▶]                    │
│                                                  │
│          Focusing on: Lập trình dự án            │
├──────────────────────────────────────────────────┤
│  🎵 Sleepy Cat (Lofi)                 [▶] [Input]│
├──────────────────────────────────────────────────┤
│  Completed Cycles: 0  |  Total Focus: 0 mins     │
├──────────────────────────────────────────────────┤
│  Tasks (1)                                       │
│  [+] Add new task...                             │
│  [ ] Lập trình dự án                             │
└──────────────────────────────────────────────────┘
```

---

## ✨ Tính năng nổi bật

- ⏱️ **Đồng hồ Pomodoro chuẩn xác:** 
  - Hỗ trợ 3 chế độ: **Tập trung** (Pomodoro), **Nghỉ ngắn** (Short Break), và **Nghỉ dài** (Long Break).
  - Tự động tối ưu hóa đếm ngược và kiểm soát sai lệch giây theo thời gian thực.
- 🎵 **Trình phát nhạc Lofi & YouTube đa năng:**
  - Tích hợp sẵn danh sách phát nhạc mặc định (Sleepy Cat Lofi, Coffee Shop, Forest Rain).
  - Cho phép tùy chỉnh chèn liên kết YouTube (hoặc Video ID) để tự động phát nhạc tương ứng khi vào các chế độ tập trung hoặc nghỉ ngơi.
  - Bật/Tắt chế độ tự động phát nhạc khi bắt đầu đếm ngược.
- 📝 **Trình quản lý công việc (Task Manager):**
  - Thêm mới, xóa và đánh dấu hoàn thành công việc nhanh chóng.
  - Chọn một công việc để đặt làm **Công việc tập trung hiện tại** (Active Task), hiển thị trực tiếp dưới đồng hồ.
  - Phân loại danh sách công việc chưa làm và đã hoàn thành rõ ràng (hỗ trợ đóng/mở danh sách).
- 📊 **Thống kê hiệu suất trực quan:**
  - Theo dõi số chu kỳ tập trung đã hoàn thành trong ngày.
  - Tính tổng thời gian tập trung thực tế (phút).
  - Thanh tiến trình (Progress Bar) chạy theo chu kỳ giúp trực quan hóa thời gian còn lại.
- 🔔 **Âm báo chime chất lượng cao:**
  - Tự động phát âm thanh thông báo nhẹ nhàng khi kết thúc mỗi chu kỳ.
  - Sử dụng công nghệ **Web Audio API** để tự tổng hợp âm thanh dạng sóng sin ngay trên trình duyệt, không phụ thuộc vào file âm thanh `.mp3` bên ngoài, tránh lỗi tải file.
- ⚙️ **Bảng cài đặt (Settings) chi tiết:**
  - Tùy chỉnh linh hoạt thời gian cho từng chế độ (Tập trung, Nghỉ ngắn, Nghỉ dài).
  - Thay đổi khoảng cách lặp lại trước khi nghỉ dài (Long Break Interval).
  - Lưu cấu hình liên kết nhạc YouTube riêng cho từng trạng thái.
- 💾 **Lưu trữ dữ liệu tự động (LocalStorage):**
  - Mọi cấu hình cài đặt, danh sách công việc và thống kê hiệu suất được tự động lưu lại trên thiết bị. Bạn sẽ không bị mất dữ liệu khi F5 hoặc đóng trình duyệt.

---

## 🛠️ Công nghệ sử dụng

GreenPoro được phát triển hoàn toàn bằng các công nghệ web thuần túy (**Vanilla Tech Stack**), giúp ứng dụng cực kỳ nhẹ, tải trang tức thì và không cần cấu hình phức tạp:

1. **HTML5:** Cấu trúc tài liệu ngữ nghĩa (Semantic HTML), tối ưu hóa SEO và khả năng tiếp cận.
2. **CSS3:** Thiết kế Responsive (tương thích Mobile/Tablet/Desktop), quản lý màu sắc tập trung qua CSS Custom Properties (Variables), cùng các hiệu ứng chuyển động mượt mà.
3. **Vanilla JavaScript (ES6):** Xử lý logic đồng hồ đếm ngược, quản lý trạng thái ứng dụng, tương tác DOM và giao tiếp API.
4. **YouTube IFrame Player API:** Tích hợp và điều khiển trình phát video YouTube ẩn dưới dạng nhạc nền.
5. **Web Audio API:** Tổng hợp tần số âm thanh cho chuông báo kết thúc chu kỳ tập trung.
6. **Web Storage API (localStorage):** Lưu trữ trạng thái và dữ liệu cục bộ trên trình duyệt.

---

## 📂 Cấu trúc mã nguồn

```text
GreenPoro/
├── index.html       # Giao diện chính của ứng dụng và các cửa sổ pop-up (Modals)
├── style.css        # Định nghĩa kiểu dáng, màu sắc giao diện và Responsive Design
├── app.js           # Xử lý toàn bộ logic ứng dụng, sự kiện, phát nhạc và âm báo
└── README.md        # Tài liệu hướng dẫn sử dụng dự án (File này)
```

---

## 🤝 Đóng góp ý kiến (Contributing)

Mọi đóng góp nhằm cải thiện GreenPoro đều được hoan nghênh! Nếu bạn tìm thấy lỗi hoặc có ý tưởng phát triển tính năng mới, vui lòng:
1. Fork dự án này.
2. Tạo một nhánh mới (`git checkout -b feature/AmazingFeature`).
3. Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`).
4. Push lên nhánh vừa tạo (`git push origin feature/AmazingFeature`).
5. Mở một **Pull Request** trên GitHub để chúng ta cùng thảo luận.

---

## 📄 Bản quyền (License)

Dự án được phân phối theo giấy phép **MIT License**. Bạn hoàn toàn có quyền sử dụng, chỉnh sửa và phân phối lại cho mục đích cá nhân hoặc thương mại. Xem chi tiết tại file [LICENSE](LICENSE) (nếu có).

---

*Chúc bạn có những giờ phút làm việc và học tập thật năng suất cùng **GreenPoro 🌿**!*
