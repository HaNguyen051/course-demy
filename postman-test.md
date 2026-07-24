# HƯỚNG DẪN KIỂM THỬ API VỚI POSTMAN - COURSEDEMY (TESTCASE NHÓM 2)

Tài liệu này hướng dẫn chi tiết cách thực hiện kiểm thử tất cả các API của dự án CourseDemy dựa trên danh sách **92 Test Cases** từ file `TestCase_Nhom_2.xlsx`.

## ⚙️ Hướng dẫn Thiết lập Môi trường (Environment)

Trước khi bắt đầu chạy các test case, bạn cần tạo một Environment trên Postman với các biến sau:

* `base_url`: `http://localhost:3000/api`
* `token_student`: JWT Token của Học viên sau khi đăng nhập thành công.
* `token_instructor`: JWT Token của Giảng viên sau khi đăng nhập thành công.
* `token_admin`: JWT Token của Admin sau khi đăng nhập thành công.
* `new_course_id`: ID của khóa học mới được tạo ra để thực hiện kiểm thử liên quan (ví dụ: `1`).
* `new_lesson_id`: ID của bài học mới được tạo ra (ví dụ: `1`).
* `certificate_code`: Mã chứng chỉ dùng để xác thực.

---

## 1. Student-Register

### 📍 TC001 — Đăng ký thành công
* **Tên Test Case:** Đăng ký hợp lệ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Chưa có tài khoản
* **Các bước thực hiện:** Mở trang > Nhập thông tin > OTP > Đăng ký
* **Dữ liệu kiểm thử:** `Email mới`
* **Kết quả mong đợi:** Tạo tài khoản

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "student_test_new@gmail.com",
  "password": "password123",
  "role": "student"
}
```

---

### 📍 TC002 — Email tồn tại
* **Tên Test Case:** Đăng ký email tồn tại
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Email đã tồn tại
* **Các bước thực hiện:** Nhập email đã tồn tại
* **Dữ liệu kiểm thử:** `admin@gmail.com`
* **Kết quả mong đợi:** Thông báo email đã tồn tại

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "admin@gmail.com",
  "password": "password123",
  "role": "student"
}
```

---

### 📍 TC003 — Thiếu email
* **Tên Test Case:** Đăng ký thiếu email
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Để trống email
* **Dữ liệu kiểm thử:** `Trống`
* **Kết quả mong đợi:** Yêu cầu nhập email

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "",
  "password": "password123",
  "role": "student"
}
```

---

### 📍 TC004 — Thiếu mật khẩu
* **Tên Test Case:** Đăng ký thiếu mật khẩu
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Để trống mật khẩu
* **Dữ liệu kiểm thử:** `Trống`
* **Kết quả mong đợi:** Yêu cầu nhập mật khẩu

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "student_test@gmail.com",
  "password": "",
  "role": "student"
}
```

---

### 📍 TC005 — Mật khẩu quá ngắn
* **Tên Test Case:** Đăng ký mật khẩu dưới 6 ký tự
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập mật khẩu ngắn
* **Dữ liệu kiểm thử:** `123`
* **Kết quả mong đợi:** Thông báo mật khẩu phải từ 6 ký tự trở lên

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "student_test@gmail.com",
  "password": "123",
  "role": "student"
}
```

---

### 📍 TC006 — Mật khẩu không khớp
* **Tên Test Case:** Đăng ký nhập lại mật khẩu sai
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập hai mật khẩu khác nhau
* **Dữ liệu kiểm thử:** `Pass: 123456; Confirm: 123457`
* **Kết quả mong đợi:** Thông báo mật khẩu nhập lại không khớp

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "student_test@gmail.com",
  "password": "123456",
  "confirm_password": "123457",
  "role": "student"
}
```

---

### 📍 TC007 — Email sai định dạng
* **Tên Test Case:** Đăng ký email thiếu @
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập email sai cấu trúc
* **Dữ liệu kiểm thử:** `testgmail.com`
* **Kết quả mong đợi:** Thông báo email không đúng định dạng

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "Nguyen Van A",
  "email": "testgmail.com",
  "password": "password123",
  "role": "student"
}
```

---

### 📍 TC008 — Ký tự đặc biệt trong tên
* **Tên Test Case:** Đăng ký tên chứa ký tự lạ
* **Độ ưu tiên:** `Low`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập tên có ký tự đặc biệt
* **Dữ liệu kiểm thử:** `@#$%`
* **Kết quả mong đợi:** Thông báo tên không hợp lệ hoặc tự động loại bỏ

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "full_name": "@#$%",
  "email": "student_special@gmail.com",
  "password": "password123",
  "role": "student"
}
```

---

## 2. Student-Login

### 📍 TC009 — Đăng nhập thành công
* **Tên Test Case:** Login hợp lệ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Nhập đúng thông tin
* **Dữ liệu kiểm thử:** `QuangAnh@gmail.com`
* **Kết quả mong đợi:** Đăng nhập thành công

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "QuangAnh@gmail.com",
  "password": "password123"
}
```

---

### 📍 TC010 — Sai mật khẩu
* **Tên Test Case:** Login sai mật khẩu
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Nhập sai mật khẩu
* **Dữ liệu kiểm thử:** `wrongpass`
* **Kết quả mong đợi:** Sai email hoặc mật khẩu

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "QuangAnh@gmail.com",
  "password": "wrongpass"
}
```

---

### 📍 TC011 — Sai email
* **Tên Test Case:** Login sai email
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Nhập email sai
* **Dữ liệu kiểm thử:** `wrongmail@gmail.com`
* **Kết quả mong đợi:** Sai email hoặc mật khẩu

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "wrongmail@gmail.com",
  "password": "password123"
}
```

---

### 📍 TC012 — Thiếu email
* **Tên Test Case:** Login thiếu email
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Để trống email
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Yêu cầu nhập email

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "",
  "password": "password123"
}
```

---

### 📍 TC013 — Thiếu mật khẩu
* **Tên Test Case:** Login thiếu mật khẩu
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Để trống mật khẩu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Yêu cầu nhập mật khẩu

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "QuangAnh@gmail.com",
  "password": ""
}
```

---

### 📍 TC014 — Sai định dạng email
* **Tên Test Case:** Login nhập sai định dạng
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Nhập email sai định dạng
* **Dữ liệu kiểm thử:** `example@ggmai.com`
* **Kết quả mong đợi:** Thông báo email không hợp lệ

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "example@ggmai.com",
  "password": "password123"
}
```

---

### 📍 TC015 — Tài khoản bị khóa
* **Tên Test Case:** Đăng nhập vào tk bị khóa
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản bị khóa trước đó
* **Các bước thực hiện:** Nhập đúng thông tin đăng nhập
* **Dữ liệu kiểm thử:** `locked@gmail.com`
* **Kết quả mong đợi:** Thông báo tài khoản đã bị khóa

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "locked@gmail.com",
  "password": "password123"
}
```

---

### 📍 TC016 — Brute Force ngăn chặn
* **Tên Test Case:** Nhập sai mật khẩu liên tiếp 5 lần
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Nhập sai pass 5 lần liên tục
* **Dữ liệu kiểm thử:** `Đăng nhập sai 5 lần`
* **Kết quả mong đợi:** Tạm khóa tài khoản trong 15 phút

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "QuangAnh@gmail.com",
  "password": "wrongpass123"
}
```

---

### 📍 TC017 — Quên mật khẩu
* **Tên Test Case:** Yêu cầu lại mật khẩu qua email
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có tài khoản
* **Các bước thực hiện:** Click Quên mật khẩu > Nhập email
* **Dữ liệu kiểm thử:** `QuangAnh@gmail.com`
* **Kết quả mong đợi:** Hệ thống gửi link/mã đặt lại mật khẩu về email

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/forgot-password
Content-Type: application/json

{
  "email": "QuangAnh@gmail.com"
}
```

---

### 📍 TC018 — Duy trì đăng nhập
* **Tên Test Case:** Chọn Ghi nhớ đăng nhập
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Tích chọn "Remember me" rồi login
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Phiên đăng nhập được lưu giữ khi tắt trình duyệt

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "QuangAnh@gmail.com",
  "password": "password123",
  "remember_me": true
}
```

---

## 3. Search

### 📍 TC019 — Tìm theo tên
* **Tên Test Case:** Tìm khóa học
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập Java
* **Dữ liệu kiểm thử:** `Java`
* **Kết quả mong đợi:** Hiển thị kết quả

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?search=Java
```

---

### 📍 TC020 — Theo giảng viên
* **Tên Test Case:** Tìm theo giảng viên
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập tên GV
* **Dữ liệu kiểm thử:** `Tran Tien Dung`
* **Kết quả mong đợi:** Hiển thị khóa học

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?search=Tran%20Tien%20Dung
```

---

### 📍 TC021 — Không có kết quả
* **Tên Test Case:** Từ khóa lạ
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Tìm
* **Dữ liệu kiểm thử:** `ABCXYZ`
* **Kết quả mong đợi:** Thông báo không tìm thấy

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?search=ABCXYZ
```

---

### 📍 TC022 — Ký tự đặc biệt
* **Tên Test Case:** Tìm ký tự
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Tìm
* **Dữ liệu kiểm thử:** `@#$`
* **Kết quả mong đợi:** Không lỗi hệ thống / Trả về không tìm thấy

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?search=@%23$
```

---

### 📍 TC023 — Chuỗi quá dài
* **Tên Test Case:** Tìm kiếm với từ khóa > 255 ký tự
* **Độ ưu tiên:** `Low`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập chuỗi cực dài
* **Dữ liệu kiểm thử:** `Chuỗi 300 ký tự`
* **Kết quả mong đợi:** Cắt chuỗi hoặc thông báo từ khóa quá dài

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?search=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

---

### 📍 TC024 — Khoảng trắng
* **Tên Test Case:** Tìm kiếm chỉ chứa khoảng trắng
* **Độ ưu tiên:** `Low`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập toàn dấu cách
* **Dữ liệu kiểm thử:** `"   "`
* **Kết quả mong đợi:** Không thực hiện tìm kiếm hoặc hiển thị toàn bộ

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?search=%20%20%20
```

---

## 4. Filter

### 📍 TC025 — Theo danh mục
* **Tên Test Case:** Lọc danh mục
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn Lập trình
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị đúng khóa học Lập trình

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?category_id=1
```

---

### 📍 TC026 — Theo giá
* **Tên Test Case:** Lọc giá
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn khoảng giá từ 200k-500k
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Đúng khoảng giá hiển thị

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?min_price=100000&max_price=500000
```

---

### 📍 TC027 — Theo sao
* **Tên Test Case:** Lọc đánh giá
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn >=4 sao
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Đúng kết quả từ 4 sao trở lên

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?rating=4
```

---

### 📍 TC028 — Theo cấp độ
* **Tên Test Case:** Lọc cấp độ
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn Cơ bản
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Đúng kết quả cấp độ Cơ bản

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?level=beginner
```

---

### 📍 TC029 — Kết hợp nhiều bộ lọc
* **Tên Test Case:** Lọc danh mục + giá + đánh giá
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn Lập trình + 200k + 5 sao
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị kết quả thỏa mãn đồng thời tất cả điều kiện

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses?category_id=1&max_price=500000&rating=4
```

---

### 📍 TC030 — Xóa bộ lọc
* **Tên Test Case:** Bỏ tất cả bộ lọc đã chọn
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đang chọn bộ lọc
* **Các bước thực hiện:** Nhấn nút "Xóa tất cả"
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Giao diện quay về danh sách khóa học mặc định

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses
```

---

## 5. Course

### 📍 TC031 — Chi tiết
* **Tên Test Case:** Xem chi tiết
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Mở khóa học
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Hiển thị đầy đủ thông tin, giá, đề cương

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/101
```

---

### 📍 TC032 — Preview
* **Tên Test Case:** Xem video thử
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhấn xem video preview
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Video chạy bình thường kèm âm thanh

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/101/sections
```

---

### 📍 TC033 — Khóa học không tồn tại
* **Tên Test Case:** Truy cập qua URL sai
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập ID khóa học bừa
* **Dữ liệu kiểm thử:** `URL /course/999999`
* **Kết quả mong đợi:** Hiển thị trang 404 Not Found

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/999999
```

---

## 6. Wishlist

### 📍 TC034 — Thêm yêu thích
* **Tên Test Case:** Danh sách yêu thích
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhấn tim
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Đã thêm vào danh sách yêu thích

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/wishlist
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "course_id": 101
}
```

---

### 📍 TC035 — Xóa yêu thích
* **Tên Test Case:** Bỏ yêu thích
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhấn tim lần nữa (khi đã thích)
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Đã xóa khỏi danh sách yêu thích

**HTTP Request mẫu trên Postman:**
```http
DELETE {{base_url}}/wishlist/101
Authorization: Bearer {{token_student}}
```

---

### 📍 TC036 — Xem danh sách
* **Tên Test Case:** Kiểm tra trang Wishlist
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã có khóa học yêu thích
* **Các bước thực hiện:** Vào trang Yêu thích
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị toàn bộ các khóa học đã lưu yêu thích

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/wishlist
Authorization: Bearer {{token_student}}
```

---

## 7. Cart

### 📍 TC037 — Thêm 1 khóa học
* **Tên Test Case:** Thêm vào giỏ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Thêm
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Thành công, cập nhật số lượng giỏ hàng = 1

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/cart
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "course_id": 101
}
```

---

### 📍 TC038 — Thêm khóa học không tồn tại
* **Tên Test Case:** Thêm vào giỏ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Thêm qua API/URL ảo
* **Dữ liệu kiểm thử:** `9999`
* **Kết quả mong đợi:** Không thành công, báo lỗi

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/cart
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "course_id": 9999
}
```

---

### 📍 TC039 — Thêm khóa học đã mua
* **Tên Test Case:** Thêm vào giỏ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Thêm khóa học đã sở hữu
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Không thành công, nút chuyển thành "Vào học ngay"

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/cart
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "course_id": 1
}
```

---

### 📍 TC040 — Trùng
* **Tên Test Case:** Thêm trùng
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Thêm lại khóa học đang có trong giỏ
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Thông báo sản phẩm đã có trong giỏ hàng

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/cart
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "course_id": 101
}
```

---

### 📍 TC041 — Xóa
* **Tên Test Case:** Xóa khỏi giỏ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhấn Xóa ở dòng khóa học
* **Dữ liệu kiểm thử:** `101`
* **Kết quả mong đợi:** Đã xóa khỏi giỏ, cập nhật lại tổng tiền

**HTTP Request mẫu trên Postman:**
```http
DELETE {{base_url}}/cart/101
Authorization: Bearer {{token_student}}
```

---

### 📍 TC042 — Giỏ trống
* **Tên Test Case:** Xem giỏ
* **Độ ưu tiên:** `Low`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Mở giỏ hàng khi chưa thêm gì
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông báo giỏ hàng trống kèm nút "Mua ngay"

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/cart
Authorization: Bearer {{token_student}}
```

---

## 8. Coupon

### 📍 TC043 — Coupon hợp lệ
* **Tên Test Case:** Áp dụng coupon còn hạn
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập SALE20
* **Dữ liệu kiểm thử:** `SALE20`
* **Kết quả mong đợi:** Giảm giá thành công, hiển thị số tiền được giảm

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/coupons/apply
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "code": "SALE20",
  "order_amount": 500000
}
```

---

### 📍 TC044 — Coupon hết hạn
* **Tên Test Case:** Áp dụng coupon hết hạn
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập OLD2025
* **Dữ liệu kiểm thử:** `OLD2025`
* **Kết quả mong đợi:** Thông báo mã giảm giá đã hết hạn

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/coupons/apply
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "code": "OLD2025",
  "order_amount": 500000
}
```

---

### 📍 TC045 — Coupon sai ký tự
* **Tên Test Case:** Áp dụng mã không tồn tại
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập mã bừa
* **Dữ liệu kiểm thử:** `SAISAI123`
* **Kết quả mong đợi:** Thông báo mã giảm giá không hợp lệ

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/coupons/apply
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "code": "SAISAI123",
  "order_amount": 500000
}
```

---

### 📍 TC046 — Không đủ điều kiện giá
* **Tên Test Case:** Áp dụng coupon cho đơn tối thiểu
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Áp dụng mã yêu cầu đơn > 500k cho đơn 100k
* **Dữ liệu kiểm thử:** `MIN500`
* **Kết quả mong đợi:** Thông báo đơn hàng không đủ điều kiện áp dụng mã

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/coupons/apply
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "code": "MIN500",
  "order_amount": 200000
}
```

---

### 📍 TC047 — Hủy áp dụng
* **Tên Test Case:** Xóa mã giảm giá đã nhập
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đang áp dụng mã thành công
* **Các bước thực hiện:** Nhấn nút "Xóa/Hủy mã"
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Tổng số tiền quay về giá gốc ban đầu

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/coupons/remove
Authorization: Bearer {{token_student}}
Content-Type: application/json

{}
```

---

## 9. Payment

### 📍 TC048 — Momo thành công
* **Tên Test Case:** Thanh toán qua ví Momo
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn Momo -> Quét mã thành công
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thanh toán thành công, chuyển hướng về trang xác nhận đơn hàng

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/payments/checkout
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "payment_method": "momo",
  "cart_items": [101]
}
```

---

### 📍 TC049 — Momo thất bại
* **Tên Test Case:** Hủy thanh toán giữa chừng
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn Momo -> Tắt app Momo/Hủy giao dịch
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông báo thanh toán không thành công, đơn hàng giữ trạng thái chờ

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/payments/momo-return?resultCode=1006
Authorization: Bearer {{token_student}}
```

---

### 📍 TC050 — Đơn hàng 0 đồng
* **Tên Test Case:** Thanh toán đơn hàng được giảm 100%
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Áp dụng coupon 100%
* **Các bước thực hiện:** Nhấn Thanh toán
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hệ thống xử lý thành công ngay không qua cổng thanh toán

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/payments/checkout
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "payment_method": "demo",
  "coupon_code": "DISCOUNT100",
  "cart_items": [101]
}
```

---

## 10. Learning

### 📍 TC051 — Video
* **Tên Test Case:** Xem video bài học
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhấn phát video
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Video chạy bình thường

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/1/sections
Authorization: Bearer {{token_student}}
```

---

### 📍 TC052 — Tốc độ video
* **Tên Test Case:** Thay đổi tốc độ phát
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Chọn tốc độ x1.5 hoặc x2
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Video phát nhanh hơn đúng tốc độ chọn

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/1/sections
Authorization: Bearer {{token_student}}
```

---

### 📍 TC053 — Chuyển bài tự động
* **Tên Test Case:** Học hết bài tự động chuyển bài
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Xem hết 100% video bài hiện tại
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hệ thống tự động chuyển sang bài tiếp theo và tích v bài cũ

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/lessons/1/complete
Authorization: Bearer {{token_student}}
```

---

## 11. Quiz

### 📍 TC054 — Làm quiz
* **Tên Test Case:** Nộp quiz
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Làm đầy đủ các câu hỏi và nhấn Nộp
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị điểm số và đáp án chi tiết (nếu có)

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/lessons/1/submit-quiz
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "answers": [
    { "question_id": 1, "selected_index": 0 },
    { "question_id": 2, "selected_index": 1 }
  ]
}
```

---

### 📍 TC055 — Nộp trống
* **Tên Test Case:** Nộp quiz khi chưa chọn đáp án
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhấn Nộp ngay khi chưa tích câu nào
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị cảnh báo hoặc tính 0 điểm

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/lessons/1/submit-quiz
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "answers": []
}
```

---

### 📍 TC056 — Hết giờ tự động nộp
* **Tên Test Case:** Làm quiz quá thời gian quy định
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Đợi thời gian đếm ngược về 0
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hệ thống tự khóa bài và tự động nộp kết quả

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/lessons/1/submit-quiz
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "answers": [
    { "question_id": 1, "selected_index": 0 }
  ],
  "timeout": true
}
```

---

## 12. Progress

### 📍 TC057 — Lưu tiến độ
* **Tên Test Case:** Lưu vị trí video đang xem
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Xem video đến phút thứ 10 rồi tắt trình duyệt
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Khi mở lại, video hiển thị đúng từ phút thứ 10

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/enrollments/1/progress
Authorization: Bearer {{token_student}}
```

---

### 📍 TC058 — Cập nhật % tiến trình
* **Tên Test Case:** Tiến độ học tập tổng quan
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Hoàn thành 5 trên 10 bài học
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Tiến trình học tập hiển thị chính xác 50% ở dashboard

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/enrollments/1/progress
Authorization: Bearer {{token_student}}
```

---

## 13. Q&A

### 📍 TC059 — Đặt câu hỏi
* **Tên Test Case:** Gửi câu hỏi trong bài học
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Nhập câu hỏi và gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Lưu câu hỏi thành công, hiển thị ở tab thảo luận

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/lessons/1/questions
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "title": "Hỏi về bài học Java",
  "content": "Cho em hỏi cú pháp khai báo biến trong Java ạ?"
}
```

---

### 📍 TC060 — Câu hỏi trống
* **Tên Test Case:** Gửi nội dung rỗng
* **Độ ưu tiên:** `Low`
* **Điều kiện tiên quyết (Preconditions):** Đã chuẩn bị môi trường
* **Các bước thực hiện:** Để trống khung thảo luận và bấm gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Nút gửi bị ẩn hoặc báo lỗi không được để trống

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/lessons/1/questions
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "title": "",
  "content": ""
}
```

---

## 14. Review

### 📍 TC061 — Đánh giá
* **Tên Test Case:** Đánh giá 5 sao kèm bình luận
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã hoàn thành khóa học
* **Các bước thực hiện:** Chọn 5 sao -> Nhập nhận xét -> Gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Đã lưu đánh giá, hiển thị công khai ở trang chi tiết khóa học

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/courses/1/reviews
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Khóa học rất hay và bổ ích!"
}
```

---

### 📍 TC062 — Sửa đánh giá
* **Tên Test Case:** Thay đổi nội dung review
* **Độ ưu tiên:** `Low`
* **Điều kiện tiên quyết (Preconditions):** Đã đánh giá trước đó
* **Các bước thực hiện:** Nhấn sửa -> Đổi thành 4 sao -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Cập nhật điểm đánh giá mới của khóa học thành công

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/courses/1/reviews
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Cập nhật bình luận khóa học tốt."
}
```

---

## 15. Certificate

### 📍 TC063 — Tải PDF
* **Tên Test Case:** Chứng chỉ hoàn thành
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đạt 100% tiến trình học
* **Các bước thực hiện:** Nhấn nút Tải chứng chỉ
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** File PDF tải về máy chứa đầy đủ tên học viên và tên khóa học

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/1/certificate
Authorization: Bearer {{token_student}}
```

---

### 📍 TC064 — Chưa đủ điều kiện tải
* **Tên Test Case:** Kiểm tra nút tải chứng chỉ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tiến trình < 100%
* **Các bước thực hiện:** Vào trang chứng chỉ
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Nút tải bị ẩn hoặc hiển thị thông báo chưa hoàn thành khóa học

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/courses/2/certificate
Authorization: Bearer {{token_student}}
```

---

## 16. Instructor

### 📍 TC065 — Tạo khóa học
* **Tên Test Case:** Tạo mới khóa học (Draft)
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Giảng viên
* **Các bước thực hiện:** Nhập tiêu đề, mô tả -> Lưu nháp
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Khóa học được tạo ở trạng thái Chờ duyệt hoặc Bản nháp

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/courses
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "title": "Khóa học Lap trinh Python Co Ban",
  "description": "Mô tả khóa học Python",
  "category_id": 1,
  "price": 250000,
  "thumbnail": "https://example.com/python.jpg",
  "level": "beginner"
}
```

---

### 📍 TC066 — Thiếu thông tin bắt buộc
* **Tên Test Case:** Tạo khóa học để trống tiêu đề
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Giảng viên
* **Các bước thực hiện:** Để trống tiêu đề -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Báo lỗi trường tiêu đề không được bỏ trống

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/courses
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "title": "",
  "description": "Thiếu tiêu đề",
  "category_id": 1,
  "price": 200000
}
```

---

### 📍 TC067 — Sửa khóa học
* **Tên Test Case:** Cập nhật thông tin khóa học
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Khóa học ở trạng thái bản nháp
* **Các bước thực hiện:** Thay đổi giá khóa học -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông tin giá mới được cập nhật thành công

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/instructor/courses/1
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "title": "Khóa học Python Nâng Cao (Updated)",
  "price": 350000
}
```

---

### 📍 TC068 — Upload video hợp lệ
* **Tên Test Case:** Tải lên video bài học (url)
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Giảng viên
* **Các bước thực hiện:** Chọn url video
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Tải lên thành công, hệ thống xử lý (processing) video tốt

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/courses/1/video
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

---

### 📍 TC069 — Upload video sai định dạng
* **Tên Test Case:** Tải lên chuỗi định dạng khác
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Giảng viên
* **Các bước thực hiện:** Điền vào chuôi không phải url
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông báo định dạng file không hỗ trợ

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/courses/1/video
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "video_url": "invalid_file_format.xyz"
}
```

---

### 📍 TC070 — Tạo quiz
* **Tên Test Case:** Thêm câu hỏi trắc nghiệm vào bài học
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Giảng viên
* **Các bước thực hiện:** Nhập câu hỏi, 4 đáp án, chọn đáp án đúng -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Đã tạo thành công bài quiz trong chương mục

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/lessons/1/questions
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "question_text": "Python là ngôn ngữ biên dịch hay thông dịch?",
  "options": [
    { "option_text": "Thông dịch", "is_correct": true },
    { "option_text": "Biên dịch", "is_correct": false }
  ]
}
```

---

### 📍 TC071 — Trả lời câu hỏi
* **Tên Test Case:** Giảng viên phản hồi học viên
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Có câu hỏi của học viên
* **Các bước thực hiện:** Chọn câu hỏi -> Nhập câu trả lời -> Gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hệ thống hiển thị câu trả lời của giảng viên ngay dưới câu hỏi

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/questions/1/answers
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "content": "Chào em, cú pháp khai báo biến trong Java là: DataType variableName = value;"
}
```

---

### 📍 TC072 — Rút tiền hợp lệ
* **Tên Test Case:** Yêu cầu rút tiền trên doanh thu
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Số dư tài khoản > 200k
* **Các bước thực hiện:** Tạo yêu cầu rút -> Nhập số tiền -> Gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Tạo yêu cầu rút thành công, trạng thái "Chờ duyệt"

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/withdrawals
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "amount": 500000,
  "bank_name": "NCB",
  "account_number": "123456789",
  "account_holder": "NGUYEN VAN A"
}
```

---

### 📍 TC073 — Rút tiền vượt số dư
* **Tên Test Case:** Yêu cầu rút số tiền lớn hơn số dư
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Số dư hiện tại 1 triệu
* **Các bước thực hiện:** Nhập số tiền rút là 2 triệu -> Gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông báo số dư không đủ để thực hiện giao dịch

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/withdrawals
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "amount": 999999999,
  "bank_name": "NCB",
  "account_number": "123456789",
  "account_holder": "NGUYEN VAN A"
}
```

---

### 📍 TC074 — Rút tiền dưới mức tối thiểu
* **Tên Test Case:** Rút số tiền nhỏ hơn quy định
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Mức tối thiểu là 50k
* **Các bước thực hiện:** Nhập số tiền rút là 20k -> Gửi
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông báo số tiền rút tối thiểu phải từ 50k trở lên

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/instructor/withdrawals
Authorization: Bearer {{token_instructor}}
Content-Type: application/json

{
  "amount": 20000,
  "bank_name": "NCB",
  "account_number": "123456789",
  "account_holder": "NGUYEN VAN A"
}
```

---

### 📍 TC075 — Xem thống kê doanh thu
* **Tên Test Case:** Kiểm tra biểu đồ doanh thu
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã có doanh thu khóa học
* **Các bước thực hiện:** Vào trang Thống kê doanh thu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị biểu đồ doanh thu chính xác theo tháng/năm

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/instructor/stats/revenue?period=12months
Authorization: Bearer {{token_instructor}}
```

---

### 📍 TC076 — Thống kê học viên
* **Tên Test Case:** Xem danh sách học viên đăng ký
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Có học viên mua khóa học
* **Các bước thực hiện:** Vào trang quản lý học viên
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị đầy đủ danh sách, ngày tham gia, tiến độ học của từng người

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/instructor/students
Authorization: Bearer {{token_instructor}}
```

---

### 📍 TC077 — Xóa khóa học nháp
* **Tên Test Case:** Xóa bỏ khóa học chưa xuất bản
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Khóa học ở trạng thái bản nháp
* **Các bước thực hiện:** Nhấn Xóa khóa học -> Xác nhận
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Khóa học biến mất khỏi danh sách quản lý của giảng viên

**HTTP Request mẫu trên Postman:**
```http
DELETE {{base_url}}/instructor/courses/{{new_course_id}}
Authorization: Bearer {{token_instructor}}
```

---

## 17. Admin

### 📍 TC078 — Duyệt khóa học
* **Tên Test Case:** Approve khóa học hợp lệ
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Vào danh sách chờ duyệt -> Nhấp Approve
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Khóa học chuyển sang trạng thái "Đã xuất bản" (Published), công khai trên web

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/courses/1/approve
Authorization: Bearer {{token_admin}}
```

---

### 📍 TC079 — Từ chối duyệt khóa học
* **Tên Test Case:** Reject khóa học vi phạm chính sách
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Vào danh sách chờ duyệt -> Nhấp Reject -> Nhập lý do
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Khóa học chuyển sang trạng thái "Bị từ chối", gửi lý do về cho GV

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/courses/1/reject
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "reason": "Nội dung vi phạm quy định sàn"
}
```

---

### 📍 TC080 — Khóa user
* **Tên Test Case:** Khóa tài khoản vi phạm tiêu chuẩn
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Tìm user -> Nhấn Khóa tài khoản -> Xác nhận
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** User bị khóa ngay lập tức, bị đăng xuất khỏi hệ thống

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/users/2/status
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "is_active": false
}
```

---

### 📍 TC081 — Mở khóa user
* **Tên Test Case:** Mở lại tài khoản bị khóa trước đó
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Tìm user bị khóa -> Nhấn Mở khóa
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Tài khoản hoạt động trở lại bình thường

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/users/2/status
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "is_active": true
}
```

---

### 📍 TC082 — Tạo coupon hệ thống
* **Tên Test Case:** Tạo mã giảm giá toàn sàn
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Nhập thông tin mã SALE30, % giảm, ngày hết hạn -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Mã coupon mới hiển thị trong hệ thống và có hiệu lực

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/admin/coupons
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "code": "ALLSAN20",
  "discount_percent": 20,
  "min_order_amount": 0,
  "expires_at": "2026-12-31"
}
```

---

### 📍 TC083 — Duyệt rút tiền thành công
* **Tên Test Case:** Xử lý lệnh rút tiền tài khoản GV
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có yêu cầu rút tiền Chờ duyệt
* **Các bước thực hiện:** Nhấn Duyệt lệnh rút tiền
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Trạng thái chuyển sang "Thành công", số dư giảng viên bị trừ tiền

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/withdrawals/1/approve
Authorization: Bearer {{token_admin}}
```

---

### 📍 TC084 — Từ chối lệnh rút tiền
* **Tên Test Case:** Từ chối lệnh rút tiền nghi vấn
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Có yêu cầu rút tiền Chờ duyệt
* **Các bước thực hiện:** Nhấn Từ chối -> Ghi lý do
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Trạng thái chuyển thành "Bị hủy", số tiền hoàn lại số dư giảng viên

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/withdrawals/1/reject
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "reason": "Thông tin tài khoản ngân hàng sai lệch"
}
```

---

### 📍 TC085 — Thống kê tổng quan
* **Tên Test Case:** Xem dashboard hệ thống
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Mở trang tổng quan
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Hiển thị đúng tổng số User, tổng doanh thu, tổng số khóa học hiện tại

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/admin/stats
Authorization: Bearer {{token_admin}}
```

---

### 📍 TC086 — Phân quyền tài khoản
* **Tên Test Case:** Chuyển user thường thành Giảng viên
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Tài khoản Admin
* **Các bước thực hiện:** Vào quản lý user -> Sửa Role thành Instructor -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** User đăng nhập lại sẽ có đầy đủ tính năng của Giảng viên

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/admin/users/2/role
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "role": "instructor"
}
```

---

## 18. Profile

### 📍 TC087 — Thay đổi avatar
* **Tên Test Case:** Cập nhật ảnh đại diện mới
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Đã đăng nhập
* **Các bước thực hiện:** Chọn ảnh .jpg dưới 2MB -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Avatar mới được hiển thị trên thanh menu và trang cá nhân

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/profile/avatar
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"
}
```

---

### 📍 TC088 — Đổi mật khẩu thành công
* **Tên Test Case:** Thay đổi mật khẩu tài khoản
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã đăng nhập
* **Các bước thực hiện:** Nhập mật khẩu cũ + mật khẩu mới -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Mật khẩu đổi thành công, hệ thống yêu cầu đăng nhập lại bằng pass mới

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/profile/password
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "current_password": "password123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

---

### 📍 TC089 — Đổi mật khẩu sai pass cũ
* **Tên Test Case:** Nhập sai mật khẩu hiện tại
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đã đăng nhập
* **Các bước thực hiện:** Nhập mật khẩu cũ sai -> Nhập mật khẩu mới -> Lưu
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Thông báo mật khẩu hiện tại không chính xác

**HTTP Request mẫu trên Postman:**
```http
PUT {{base_url}}/profile/password
Authorization: Bearer {{token_student}}
Content-Type: application/json

{
  "current_password": "wrongpassword",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

---

## 19. Notification

### 📍 TC090 — Nhận thông báo mua khóa học
* **Tên Test Case:** Thông báo real-time khi mua thành công
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** Học viên mua khóa học
* **Các bước thực hiện:** Kiểm tra biểu tượng chuông thông báo
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Bạn đã đăng ký thành công khóa học...

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/notifications
Authorization: Bearer {{token_student}}
```

---

### 📍 TC091 — Thông báo có câu trả lời
* **Tên Test Case:** Học viên nhận được phản hồi từ GV
* **Độ ưu tiên:** `Medium`
* **Điều kiện tiên quyết (Preconditions):** GV đã trả lời câu hỏi Q&A
* **Các bước thực hiện:** Kiểm tra thông báo của học viên
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Giảng viên đã trả lời câu hỏi của bạn...

**HTTP Request mẫu trên Postman:**
```http
GET {{base_url}}/notifications
Authorization: Bearer {{token_student}}
```

---

## 20. System

### 📍 TC092 — Đăng xuất
* **Tên Test Case:** Đăng xuất tài khoản khỏi hệ thống
* **Độ ưu tiên:** `High`
* **Điều kiện tiên quyết (Preconditions):** Đang đăng nhập
* **Các bước thực hiện:** Click Đăng xuất -> Xác nhận
* **Dữ liệu kiểm thử:** `Theo mẫu JSON`
* **Kết quả mong đợi:** Xóa token/session, đưa người dùng quay lại trang chủ ở trạng thái chưa đăng nhập

**HTTP Request mẫu trên Postman:**
```http
POST {{base_url}}/auth/logout
Authorization: Bearer {{token_student}}
```

---
