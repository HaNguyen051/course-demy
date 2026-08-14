require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/database');

const SALT_ROUNDS = 10;

async function seed() {
  console.log('🌱 Bắt đầu seed dữ liệu...\n');

  // ─── Xóa dữ liệu cũ (tắt FK để tránh lỗi constraint) ────────────────────────
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM quiz_questions;
    DELETE FROM lesson_progress;
    DELETE FROM lesson_answers;
    DELETE FROM lesson_questions;
    DELETE FROM lessons;
    DELETE FROM course_sections;
    DELETE FROM sections;
    DELETE FROM certificates;
    DELETE FROM notification_reads;
    DELETE FROM notifications;
    DELETE FROM reviews;
    DELETE FROM wishlists;
    DELETE FROM enrollments;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart_items;
    DELETE FROM wallet_transactions;
    DELETE FROM withdrawal_requests;
    DELETE FROM payments;
    DELETE FROM coupons;
    DELETE FROM courses;
    DELETE FROM categories;
    DELETE FROM users;
  `);
  db.pragma('foreign_keys = ON');
  console.log('✅ Đã xóa dữ liệu cũ');

  // ─── Insert Users ────────────────────────────────────────────────────────────
  const insertUser = db.prepare(`
    INSERT INTO users (full_name, email, password, role, balance, is_active)
    VALUES (@full_name, @email, @password, @role, @balance, 1)
  `);

  const usersData = [
    { full_name: 'Admin CourseDemy',      email: 'admin@coursedemy.com',      password: 'admin123',   role: 'admin',      balance: 0 },
    { full_name: 'Tran Thi Minh Anh',     email: 'instructor1@example.com',   password: '123456',     role: 'instructor', balance: 3500000 },
    { full_name: 'Le Van Hung',           email: 'instructor2@example.com',   password: '123456',     role: 'instructor', balance: 1200000 },
    { full_name: 'Nguyen Van An',         email: 'student1@example.com',      password: '123456',     role: 'student',    balance: 500000 },
    { full_name: 'Pham Thi Bich',         email: 'student2@example.com',      password: '123456',     role: 'student',    balance: 200000 },
    { full_name: 'Hoang Minh Duc',        email: 'student3@example.com',      password: '123456',     role: 'student',    balance: 0 },
    { full_name: 'Vo Thi Kim Chi',        email: 'student4@example.com',      password: '123456',     role: 'student',    balance: 150000 },
  ];

  const hashedUsers = await Promise.all(
    usersData.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, SALT_ROUNDS),
    }))
  );

  const insertManyUsers = db.transaction((users) => {
    for (const user of users) insertUser.run(user);
  });
  insertManyUsers(hashedUsers);

  const admin       = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@coursedemy.com');
  const instructor1 = db.prepare('SELECT id FROM users WHERE email = ?').get('instructor1@example.com');
  const instructor2 = db.prepare('SELECT id FROM users WHERE email = ?').get('instructor2@example.com');
  const student1    = db.prepare('SELECT id FROM users WHERE email = ?').get('student1@example.com');
  const student2    = db.prepare('SELECT id FROM users WHERE email = ?').get('student2@example.com');
  const student3    = db.prepare('SELECT id FROM users WHERE email = ?').get('student3@example.com');
  const student4    = db.prepare('SELECT id FROM users WHERE email = ?').get('student4@example.com');

  console.log(`✅ Đã insert ${usersData.length} users`);

  // ─── Insert Categories ───────────────────────────────────────────────────────
  const insertCategory = db.prepare(`
    INSERT INTO categories (name, description) VALUES (@name, @description)
  `);

  const categoriesData = [
    { name: 'Lap trinh',   description: 'Cac khoa hoc ve lap trinh va phat trien phan mem' },
    { name: 'Thiet ke',    description: 'Cac khoa hoc ve UI/UX va do hoa' },
    { name: 'Ngoai ngu',   description: 'Cac khoa hoc hoc tieng Anh, Nhat, Han' },
    { name: 'Kinh doanh',  description: 'Cac khoa hoc ve kinh doanh va khoi nghiep' },
    { name: 'Du lieu',     description: 'Khoa hoc du lieu, phan tich va machine learning' },
  ];

  const insertManyCategories = db.transaction((categories) => {
    for (const cat of categories) insertCategory.run(cat);
  });
  insertManyCategories(categoriesData);

  const catLapTrinh  = db.prepare('SELECT id FROM categories WHERE name = ?').get('Lap trinh');
  const catThietKe   = db.prepare('SELECT id FROM categories WHERE name = ?').get('Thiet ke');
  const catNgoaiNgu  = db.prepare('SELECT id FROM categories WHERE name = ?').get('Ngoai ngu');
  const catKinhDoanh = db.prepare('SELECT id FROM categories WHERE name = ?').get('Kinh doanh');
  const catDuLieu    = db.prepare('SELECT id FROM categories WHERE name = ?').get('Du lieu');

  console.log(`✅ Đã insert ${categoriesData.length} categories`);

  // ─── Insert Courses ──────────────────────────────────────────────────────────
  const insertCourse = db.prepare(`
    INSERT INTO courses (title, description, price, category_id, instructor_id, thumbnail, status, level)
    VALUES (@title, @description, @price, @category_id, @instructor_id, @thumbnail, @status, @level)
  `);

  const coursesData = [
    {
      title: 'Lap trinh Python tu co ban den nang cao',
      description: 'Khoa hoc lap trinh Python toan dien danh cho nguoi moi bat dau. Ban se hoc tu cu phap co ban, kieu du lieu, vong lap, ham, den lap trinh huong doi tuong (OOP), xu ly file, va cac thu vien pho bien nhu NumPy, Pandas. Cuoi khoa, ban se tu xay dung duoc cac project thuc te.',
      price: 299000,
      category_id: catLapTrinh.id,
      instructor_id: instructor1.id,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=480&h=270&fit=crop',	// Python
      status: 'approved',
      level: 'beginner',
    },
    {
      title: 'JavaScript Fullstack - React & Node.js',
      description: 'Hoc JavaScript theo huong fullstack tu nen tang den chuyen sau. Phan Frontend bao gom ES6+, React hooks, Redux Toolkit, va React Router. Phan Backend bao gom Node.js, Express, RESTful API, va ket noi database. Ban se hoan thien mot du an thuc te la ung dung quan ly cong viec.',
      price: 499000,
      category_id: catLapTrinh.id,
      instructor_id: instructor1.id,
      thumbnail: 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg',
      status: 'approved',
      level: 'intermediate',
    },
    {
      title: 'Thiet ke UI/UX chuyen nghiep voi Figma',
      description: 'Nam vung tu duy thiet ke va cong cu Figma de tao ra cac giao dien dep va trai nghiem nguoi dung xuat sac. Khoa hoc bao gom: nguyen tac thiet ke UI/UX, Auto Layout, Component & Variant, Prototype, Design System, va thuc hanh thiet ke lai giao dien cua cac app noi tieng.',
      price: 349000,
      category_id: catThietKe.id,
      instructor_id: instructor2.id,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=480&h=270&fit=crop',	// UI/UX Figma
      status: 'approved',
      level: 'beginner',
    },
    {
      title: 'Tieng Anh giao tiep thuc chien B1-B2',
      description: 'Chuong trinh hoc tieng Anh giao tiep duoc thiet ke theo chuan CEFR tu B1 len B2. Khoa hoc tap trung vao 4 ky nang: Nghe - Noi - Doc - Viet trong cac tinh huong thuc te nhu phong van xin viec, thuyet trinh, hoi thoai van phong va du lich.',
      price: 199000,
      category_id: catNgoaiNgu.id,
      instructor_id: instructor2.id,
      thumbnail: 'https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg',
      status: 'approved',
      level: 'intermediate',
    },
    {
      title: 'Khoi nghiep tu y tuong den thuc thi',
      description: 'Khoa hoc mien phi giup ban hieu ro hanh trinh khoi nghiep tu A den Z. Ban se hoc cach xac nhan y tuong kinh doanh, xay dung mo hinh Business Model Canvas, phan tich doi thu canh tranh, lap ke hoach tai chinh don gian va chien luoc marketing buoc dau.',
      price: 0,
      category_id: catKinhDoanh.id,
      instructor_id: instructor1.id,
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=480&h=270&fit=crop',	// Khởi nghiệp
      status: 'approved',
      level: 'beginner',
    },
    {
      title: 'Data Science voi Python - Machine Learning co ban',
      description: 'Bat dau hanh trinh Data Science voi Python va cac thu vien hang dau: NumPy, Pandas, Matplotlib, Scikit-learn. Ban se hoc phan tich du lieu thuc te, truc quan hoa du lieu, xay dung mo hinh Machine Learning (Linear Regression, Decision Tree, Random Forest) va danh gia hieu suat mo hinh.',
      price: 599000,
      category_id: catDuLieu.id,
      instructor_id: instructor1.id,
      thumbnail: 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
      status: 'approved',
      level: 'intermediate',
    },
    {
      title: 'Docker va Kubernetes cho nguoi moi',
      description: 'Lam quen voi container hoa ung dung bang Docker va quan ly cluster voi Kubernetes. Khoa hoc bao gom: Docker image & container, Dockerfile, Docker Compose, Kubernetes Pod/Service/Deployment, Helm chart va CI/CD pipeline co ban. Thuc hanh trien khai ung dung Node.js len Kubernetes cluster.',
      price: 450000,
      category_id: catLapTrinh.id,
      instructor_id: instructor2.id,
      thumbnail: 'https://img-c.udemycdn.com/course/480x270/1673754_8a26_3.jpg',
      status: 'pending',
      level: 'advanced',
    },
    {
      title: 'Marketing Online - SEO va Quang cao Google Ads',
      description: 'Tong quan ve marketing online hien dai, tap trung vao SEO on-page/off-page va quang cao Google Ads. Ban se hoc cach nghien cuu tu khoa, toi uu bai viet, xay dung backlink, thiet lap chien dich Search/Display/Shopping Ads, phan tich ROI va toi uu ngan sach quang cao.',
      price: 199000,
      category_id: catKinhDoanh.id,
      instructor_id: instructor2.id,
      thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=480&h=270&fit=crop',	// Marketing
      status: 'approved',
      level: 'beginner',
    },
  ];

  const insertManyCourses = db.transaction((courses) => {
    for (const course of courses) insertCourse.run(course);
  });
  insertManyCourses(coursesData);

  const course1 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Lap trinh Python tu co ban den nang cao');
  const course2 = db.prepare('SELECT id FROM courses WHERE title = ?').get('JavaScript Fullstack - React & Node.js');
  const course3 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Thiet ke UI/UX chuyen nghiep voi Figma');
  const course4 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Tieng Anh giao tiep thuc chien B1-B2');
  const course5 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Khoi nghiep tu y tuong den thuc thi');
  const course6 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Data Science voi Python - Machine Learning co ban');
  const course7 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Docker va Kubernetes cho nguoi moi');
  const course8 = db.prepare('SELECT id FROM courses WHERE title = ?').get('Marketing Online - SEO va Quang cao Google Ads');

  console.log(`✅ Đã insert ${coursesData.length} courses`);

  // ─── Helper: Insert Section with Lessons & Quiz ───────────────────────────────
  function insertSectionWithLessons(courseId, sectionTitle, sectionPos, lessonsArr) {
    const doInsert = db.transaction(() => {
      const secRes = db.prepare(
        'INSERT INTO course_sections (course_id, title, position) VALUES (?, ?, ?)'
      ).run(courseId, sectionTitle, sectionPos);
      const sectionId = secRes.lastInsertRowid;

      db.prepare(
        'INSERT OR IGNORE INTO sections (id, course_id, title, position) VALUES (?, ?, ?, ?)'
      ).run(sectionId, courseId, sectionTitle, sectionPos);

      lessonsArr.forEach((lesson, lPos) => {
        const lessonRes = db.prepare(`
          INSERT INTO lessons
            (section_id, course_id, title, type, video_url, content_body, duration_seconds, position, is_preview)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          sectionId, courseId,
          lesson.title, lesson.type,
          lesson.video_url || null,
          lesson.content_body || null,
          lesson.duration_seconds || null,
          lPos,
          lesson.is_preview ? 1 : 0
        );
        const lessonId = lessonRes.lastInsertRowid;

        if (lesson.type === 'quiz' && Array.isArray(lesson.questions)) {
          lesson.questions.forEach((q, qPos) => {
            db.prepare(`
              INSERT INTO quiz_questions (lesson_id, question_text, options, correct_index, position)
              VALUES (?, ?, ?, ?, ?)
            `).run(lessonId, q.question_text, JSON.stringify(q.options), q.correct_index, qPos);
          });
        }
      });

      return sectionId;
    });
    return doInsert();
  }

  // ─── Course 1: Python ─────────────────────────────────────────────────────────
  insertSectionWithLessons(course1.id, 'Gioi thieu & Cai dat moi truong', 0, [
    { title: 'Khoa hoc nay day gi? Lo trinh hoc Python', type: 'video', video_url: 'https://www.youtube.com/embed/rfscVS0vtbw', duration_seconds: 480, is_preview: true },
    { title: 'Cai dat Python va VS Code', type: 'video', video_url: 'https://www.youtube.com/embed/VukelI2iyZU', duration_seconds: 720, is_preview: true },
    { title: 'Chay chuong trinh Python dau tien - Hello World', type: 'video', video_url: 'https://www.youtube.com/embed/rkX_TWCZS8s', duration_seconds: 360, is_preview: false },
  ]);

  insertSectionWithLessons(course1.id, 'Cu phap co ban Python', 1, [
    { title: 'Bien, kieu du lieu va toan tu', type: 'video', video_url: 'https://www.youtube.com/embed/cQT33yu9pY8', duration_seconds: 900, is_preview: false },
    {
      title: 'Tong quan kieu du lieu Python', type: 'content', is_preview: false,
      content_body: `## Kieu du lieu trong Python

Python co cac kieu du lieu co ban sau:

### Kieu so
- **int**: So nguyen (vi du: 42, -10)
- **float**: So thuc (vi du: 3.14, -0.5)
- **complex**: So phuc (vi du: 2+3j)

### Kieu chuoi
- **str**: Chuoi ky tu (vi du: "Hello", 'World')

### Kieu Boolean
- **bool**: True hoac False

### Kieu tap hop
- **list**: Danh sach co thu tu, thay doi duoc
- **tuple**: Bo du lieu co thu tu, khong thay doi
- **set**: Tap hop khong trung lap
- **dict**: Tu dien key-value

### Vi du code
\`\`\`python
name = "Alice"      # str
age = 25            # int
height = 1.65       # float
is_student = True   # bool
scores = [9, 8, 7]  # list
\`\`\``,
    },
    { title: 'Vong lap for va while', type: 'video', video_url: 'https://www.youtube.com/embed/dHANJ4l6fwA', duration_seconds: 1020, is_preview: false },
    {
      title: 'Kiem tra - Cu phap co ban Python', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Kieu du lieu nao dung de luu chuoi ky tu trong Python?', options: ['int', 'str', 'float', 'bool'], correct_index: 1 },
        { question_text: 'Cau lenh nao dung de in ra man hinh trong Python?', options: ['echo()', 'console.log()', 'print()', 'System.out.println()'], correct_index: 2 },
        { question_text: 'Ket qua cua bieu thuc type(3.14) la gi?', options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'double'>"], correct_index: 2 },
        { question_text: 'List trong Python la kieu du lieu nhu the nao?', options: ['Khong thu tu, khong thay doi duoc', 'Co thu tu, thay doi duoc', 'Co thu tu, khong thay doi duoc', 'Khong thu tu, thay doi duoc'], correct_index: 1 },
      ],
    },
  ]);

  insertSectionWithLessons(course1.id, 'Ham va lap trinh huong doi tuong', 2, [
    { title: 'Dinh nghia va goi ham trong Python', type: 'video', video_url: 'https://www.youtube.com/embed/9Os0o3wzS_I', duration_seconds: 1140, is_preview: false },
    { title: 'Lap trinh huong doi tuong - Class & Object', type: 'video', video_url: 'https://www.youtube.com/embed/apACNr7DC_s', duration_seconds: 1500, is_preview: false },
    { title: 'Ke thua va Polymorphism trong Python', type: 'video', video_url: 'https://www.youtube.com/embed/RSl87lqOXDE', duration_seconds: 1260, is_preview: false },
    {
      title: 'Kiem tra - Ham va OOP', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Tu khoa nao dung de dinh nghia mot ham trong Python?', options: ['function', 'func', 'def', 'define'], correct_index: 2 },
        { question_text: 'Tham so dac biet nao luon la tham so dau tien trong method cua class?', options: ['this', 'self', 'cls', 'me'], correct_index: 1 },
        { question_text: 'Phuong thuc khoi tao trong Python duoc dat ten la gi?', options: ['__start__', '__init__', '__new__', '__create__'], correct_index: 1 },
      ],
    },
  ]);

  // ─── Course 2: JavaScript Fullstack ──────────────────────────────────────────
  insertSectionWithLessons(course2.id, 'JavaScript ES6+ hien dai', 0, [
    { title: 'Arrow Function, Template Literal va Destructuring', type: 'video', video_url: 'https://www.youtube.com/embed/NCwa_xi0Uuc', duration_seconds: 960, is_preview: true },
    { title: 'Promise, Async/Await va xu ly bat dong bo', type: 'video', video_url: 'https://www.youtube.com/embed/DHvZLI7Db8E', duration_seconds: 1320, is_preview: false },
    {
      title: 'Module ES6 - import/export', type: 'content', is_preview: false,
      content_body: `## Module trong JavaScript ES6

### Named Export
\`\`\`js
export const add = (a, b) => a + b;
import { add } from './math.js';
\`\`\`

### Default Export
\`\`\`js
export default function greet(name) { return "Hello " + name; }
import greet from './greeting.js';
\`\`\`

### Khi nao dung Named vs Default?
- **Named export**: Khi module xuat nhieu thu
- **Default export**: Khi module chi xuat mot thu chinh`,
    },
    {
      title: 'Kiem tra - ES6+ JavaScript', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Arrow function co diem khac biet chinh gi so voi function thuong?', options: ['Chay nhanh hon', 'Khong co this binding rieng', 'Co the dung lam constructor', 'Tu dong tra ve undefined'], correct_index: 1 },
        { question_text: 'async/await duoc dung de lam gi?', options: ['Tang toc code dong bo', 'Viet code bat dong bo theo kieu dong bo de doc hon', 'Thay the hoan toan Promise', 'Khai bao bien bat bien'], correct_index: 1 },
        { question_text: 'Destructuring const { name, age } = user lam gi?', options: ['Xoa thuoc tinh name va age khoi user', 'Tao ban sao cua object user', 'Trich xuat name va age tu user thanh bien rieng', 'Kiem tra user co name va age khong'], correct_index: 2 },
      ],
    },
  ]);

  insertSectionWithLessons(course2.id, 'React - Xay dung giao dien', 1, [
    { title: 'React co ban - JSX, Component va Props', type: 'video', video_url: 'https://www.youtube.com/embed/Tn6-PIqc4UM', duration_seconds: 1680, is_preview: true },
    { title: 'useState va useEffect Hooks', type: 'video', video_url: 'https://www.youtube.com/embed/O6P86uwfdR0', duration_seconds: 1440, is_preview: false },
    { title: 'React Router va dieu huong trang', type: 'video', video_url: 'https://www.youtube.com/embed/Ul3y1LXxzdU', duration_seconds: 1200, is_preview: false },
    {
      title: 'Kiem tra - React Hooks', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Hook nao dung de quan ly state trong React functional component?', options: ['useEffect', 'useContext', 'useState', 'useReducer'], correct_index: 2 },
        { question_text: 'useEffect chay khi nao neu dependency array la [] (mang rong)?', options: ['Moi lan render', 'Chi mot lan sau lan render dau tien', 'Khong bao gio chay', 'Moi lan state thay doi'], correct_index: 1 },
        { question_text: 'Props trong React la gi?', options: ['State noi bo cua component', 'Du lieu duoc truyen tu component cha xuong component con', 'Du lieu luu trong localStorage', 'Lifecycle method cua component'], correct_index: 1 },
      ],
    },
  ]);

  insertSectionWithLessons(course2.id, 'Node.js & Express - Backend API', 2, [
    { title: 'Gioi thieu Node.js va Express framework', type: 'video', video_url: 'https://www.youtube.com/embed/fBNz5xF-Kx4', duration_seconds: 1080, is_preview: false },
    { title: 'Xay dung RESTful API voi Express', type: 'video', video_url: 'https://www.youtube.com/embed/pKd0Rpw7O48', duration_seconds: 1800, is_preview: false },
    { title: 'Xac thuc nguoi dung voi JWT', type: 'video', video_url: 'https://www.youtube.com/embed/7Q17ubqLfaM', duration_seconds: 1560, is_preview: false },
    {
      title: 'Kiem tra - Node.js & REST API', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'HTTP method nao thuong dung de tao moi du lieu (Create)?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct_index: 1 },
        { question_text: 'JWT la viet tat cua gi?', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Token', 'Joint Web Technology'], correct_index: 1 },
        { question_text: 'Status code nao tra ve khi tao resource thanh cong?', options: ['200', '201', '204', '301'], correct_index: 1 },
      ],
    },
  ]);

  // ─── Course 3: UI/UX Figma ────────────────────────────────────────────────────
  insertSectionWithLessons(course3.id, 'Nen tang thiet ke UI/UX', 0, [
    { title: 'Su khac biet giua UI va UX', type: 'video', video_url: 'https://www.youtube.com/embed/5CxXhyhT6Fc', duration_seconds: 540, is_preview: true },
    {
      title: '10 nguyen tac thiet ke UX cua Jakob Nielsen', type: 'content', is_preview: false,
      content_body: `## 10 Heuristics cua Jakob Nielsen

1. **Visibility of System Status** - Luon cho nguoi dung biet he thong dang lam gi
2. **Match Between System and the Real World** - Dung ngon ngu nguoi dung hieu
3. **User Control and Freedom** - Cung cap undo/redo
4. **Consistency and Standards** - Nhat quan trong thiet ke
5. **Error Prevention** - Ngan loi truoc khi xay ra
6. **Recognition Rather Than Recall** - Giam tai bo nho cho nguoi dung
7. **Flexibility and Efficiency** - Ho tro ca nguoi moi va chuyen gia
8. **Aesthetic and Minimalist Design** - Chi hien thi thong tin can thiet
9. **Help Users Recognize, Diagnose, and Recover from Errors** - Thong bao loi ro rang
10. **Help and Documentation** - Cung cap tai lieu khi can`,
    },
  ]);

  insertSectionWithLessons(course3.id, 'Lam quen voi Figma', 1, [
    { title: 'Tong quan giao dien Figma', type: 'video', video_url: 'https://www.youtube.com/embed/FTFaQWZBqQ8', duration_seconds: 900, is_preview: true },
    { title: 'Auto Layout - Bi quyet thiet ke responsive', type: 'video', video_url: 'https://www.youtube.com/embed/TyaGpGDFczw', duration_seconds: 1080, is_preview: false },
    { title: 'Component va Variant trong Figma', type: 'video', video_url: 'https://www.youtube.com/embed/k74IrUNaJVk', duration_seconds: 1320, is_preview: false },
    {
      title: 'Kiem tra - Figma co ban', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Auto Layout trong Figma duoc dung de lam gi?', options: ['Tu dong chon mau sac', 'Tao layout tu dong dieu chinh khi noi dung thay doi', 'Xuat file tu dong', 'Dong bo design voi code'], correct_index: 1 },
        { question_text: 'Component trong Figma cho phep ban lam gi?', options: ['Chia se design voi nguoi khac', 'Tao phan tu tai su dung va dong bo thay doi', 'Chay prototype', 'Export code CSS'], correct_index: 1 },
      ],
    },
  ]);

  // ─── Course 4: Tieng Anh ──────────────────────────────────────────────────────
  insertSectionWithLessons(course4.id, 'Phat am va Ngu dieu', 0, [
    { title: 'Am thanh tieng Anh - IPA co ban', type: 'video', video_url: 'https://www.youtube.com/embed/n4gdN0q0L-0', duration_seconds: 720, is_preview: true },
    { title: 'Stress va Intonation trong cau', type: 'video', video_url: 'https://www.youtube.com/embed/S-ibSlOcM-Y', duration_seconds: 840, is_preview: false },
  ]);

  insertSectionWithLessons(course4.id, 'Tieng Anh van phong', 1, [
    { title: 'Email tieng Anh chuyen nghiep', type: 'video', video_url: 'https://www.youtube.com/embed/qs2J8G5xjW0', duration_seconds: 960, is_preview: false },
    { title: 'Phong van xin viec bang tieng Anh', type: 'video', video_url: 'https://www.youtube.com/embed/HG68Ymazo18', duration_seconds: 1200, is_preview: false },
    {
      title: 'Mau cau giao tiep van phong thuong dung', type: 'content', is_preview: false,
      content_body: `## 20 Mau Cau Tieng Anh Van Phong

### Mo dau cuoc hop
- "Shall we get started?" - Chung ta bat dau nhe?
- "Let's go over the agenda." - Hay di qua chuong trinh nghi su.

### De xuat y kien
- "I'd like to suggest..." - Toi muon de xuat...
- "What if we...?" - Neu chung ta...?

### Dong y / Khong dong y
- "That's a great point." - Do la mot diem rat hay.
- "I see your point, but..." - Toi hieu y ban, nhung...

### Ket thuc cuoc hop
- "Let's wrap up." - Hay ket thuc nao.
- "I'll send the minutes later." - Toi se gui bien ban sau.`,
    },
    {
      title: 'Kiem tra - Tu vung van phong', type: 'quiz', is_preview: false,
      questions: [
        { question_text: '"Let\'s wrap up" co nghia la gi?', options: ['Bat dau cuoc hop', 'Ket thuc cuoc hop', 'Goi qua', 'Tom tat bao cao'], correct_index: 1 },
        { question_text: 'Cau nao phu hop khi ban muon de xuat mot y kien?', options: ['"You must do this."', '"I\'d like to suggest..."', '"That\'s wrong."', '"Never mind."'], correct_index: 1 },
        { question_text: '"Minutes" trong ngu canh cuoc hop co nghia la gi?', options: ['Phut', 'Bien ban hop', 'Chuong trinh hop', 'Nguoi tham du'], correct_index: 1 },
      ],
    },
  ]);

  // ─── Course 5: Khoi nghiep (mien phi) ────────────────────────────────────────
  insertSectionWithLessons(course5.id, 'Tu duy khoi nghiep', 0, [
    { title: 'Startup la gi? Hanh trinh khoi nghiep', type: 'video', video_url: 'https://www.youtube.com/embed/jM5R7E75jxA', duration_seconds: 660, is_preview: true },
    { title: 'Tu duy Growth Mindset trong kinh doanh', type: 'video', video_url: 'https://www.youtube.com/embed/KUWn_TJTrnU', duration_seconds: 780, is_preview: true },
  ]);

  insertSectionWithLessons(course5.id, 'Business Model Canvas', 1, [
    { title: 'Business Model Canvas - 9 o quan trong', type: 'video', video_url: 'https://www.youtube.com/embed/IP0cUBWTgpY', duration_seconds: 960, is_preview: false },
    {
      title: 'Phan tich Value Proposition', type: 'content', is_preview: false,
      content_body: `## Value Proposition Canvas

Value Proposition (De xuat gia tri) la trai tim cua Business Model Canvas.

### Customer Profile
1. **Jobs to be done**: Khach hang dang co gang hoan thanh dieu gi?
2. **Pains**: Nhung van de, rui ro, ket qua khong mong muon
3. **Gains**: Loi ich, ket qua mong muon

### Value Map
1. **Products & Services**: San pham ban cung cap
2. **Pain Relievers**: Giai quyet pain points the nao
3. **Gain Creators**: Tao ra gains the nao`,
    },
    {
      title: 'Kiem tra - Business Model Canvas', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Business Model Canvas co bao nhieu o (building blocks)?', options: ['5', '7', '9', '12'], correct_index: 2 },
        { question_text: '"Value Proposition" trong BMC la gi?', options: ['Chi phi hoat dong cua doanh nghiep', 'Gia tri ma san pham/dich vu mang lai cho khach hang', 'So luong khach hang muc tieu', 'Kenh phan phoi san pham'], correct_index: 1 },
      ],
    },
  ]);

  // ─── Course 6: Data Science ────────────────────────────────────────────────────
  insertSectionWithLessons(course6.id, 'Python cho Data Science', 0, [
    { title: 'NumPy - Mang va tinh toan so hoc', type: 'video', video_url: 'https://www.youtube.com/embed/QUT1VHiLmmI', duration_seconds: 1380, is_preview: true },
    { title: 'Pandas - Phan tich du lieu voi DataFrame', type: 'video', video_url: 'https://www.youtube.com/embed/vmEHCJofslg', duration_seconds: 1560, is_preview: false },
    { title: 'Matplotlib va Seaborn - Truc quan hoa du lieu', type: 'video', video_url: 'https://www.youtube.com/embed/a9UrKTVEeZA', duration_seconds: 1440, is_preview: false },
  ]);

  insertSectionWithLessons(course6.id, 'Machine Learning co ban', 1, [
    { title: 'Linear Regression - Hoi quy tuyen tinh', type: 'video', video_url: 'https://www.youtube.com/embed/nk2CQITm_eo', duration_seconds: 1680, is_preview: false },
    { title: 'Classification - Decision Tree & Random Forest', type: 'video', video_url: 'https://www.youtube.com/embed/PHxYNGo8NcI', duration_seconds: 1800, is_preview: false },
    {
      title: 'Danh gia mo hinh - Accuracy, Precision, Recall', type: 'content', is_preview: false,
      content_body: `## Danh gia mo hinh phan loai

### Confusion Matrix
| | Predicted Positive | Predicted Negative |
|---|---|---|
| Actual + | TP (True Positive) | FN (False Negative)|
| Actual - | FP (False Positive)| TN (True Negative) |

### Cac chi so danh gia
- **Accuracy** = (TP + TN) / (TP + TN + FP + FN)
- **Precision** = TP / (TP + FP)
- **Recall** = TP / (TP + FN)
- **F1 Score** = 2 x (Precision x Recall) / (Precision + Recall)

### Khi nao dung chi so nao?
- **Spam filter**: Precision quan trong
- **Benh ung thu**: Recall quan trong`,
    },
    {
      title: 'Kiem tra - Machine Learning co ban', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'Thuat toan nao phu hop nhat cho bai toan du doan gia nha (gia tri lien tuc)?', options: ['Logistic Regression', 'Linear Regression', 'Decision Tree Classifier', 'K-Means Clustering'], correct_index: 1 },
        { question_text: 'Overfitting xay ra khi nao?', options: ['Mo hinh hoc qua it tu du lieu', 'Mo hinh hoc qua tot tren tap train nhung kem tren tap test', 'Du lieu training qua it', 'Mo hinh co qua it tham so'], correct_index: 1 },
        { question_text: 'Train/Test split thuong dung ty le nao?', options: ['50/50', '60/40', '80/20', '90/10'], correct_index: 2 },
        { question_text: 'Thu vien nao trong Python thuong dung cho Machine Learning?', options: ['Django', 'Scikit-learn', 'Flask', 'Pygame'], correct_index: 1 },
      ],
    },
  ]);

  // ─── Course 8: Marketing Online ───────────────────────────────────────────────
  insertSectionWithLessons(course8.id, 'SEO Co ban', 0, [
    { title: 'SEO la gi? Tai sao SEO quan trong', type: 'video', video_url: 'https://www.youtube.com/embed/hF515-0Tduk', duration_seconds: 780, is_preview: true },
    { title: 'Nghien cuu tu khoa voi Google Keyword Planner', type: 'video', video_url: 'https://www.youtube.com/embed/fnApYyNGhf8', duration_seconds: 960, is_preview: false },
    {
      title: 'On-page SEO - Toi uu noi dung', type: 'content', is_preview: false,
      content_body: `## Checklist On-page SEO

### Toi uu Title Tag
- Bao gom tu khoa chinh o dau title
- Do dai: 50-60 ky tu
- Vi du: "Hoc Python mien phi | CourseDemy"

### Meta Description
- Tom tat noi dung trang, 150-160 ky tu
- Bao gom tu khoa va call-to-action

### Heading Structure
- Chi co 1 the H1 per page
- H2, H3 cho cac phan con

### Toi uu hinh anh
- Alt text mo ta ro hinh anh
- Ten file co nghia (python-tutorial.jpg)
- Nen hinh de tang toc do tai`,
    },
    {
      title: 'Kiem tra - SEO co ban', type: 'quiz', is_preview: false,
      questions: [
        { question_text: 'SEO viet tat cua tu gi?', options: ['Social Engine Optimization', 'Search Engine Optimization', 'Site Enhancement Operations', 'System Efficiency Optimization'], correct_index: 1 },
        { question_text: 'Do dai ly tuong cua Title Tag la bao nhieu ky tu?', options: ['20-30 ky tu', '50-60 ky tu', '100-120 ky tu', '150-160 ky tu'], correct_index: 1 },
        { question_text: 'Moi trang web nen co bao nhieu the H1?', options: ['Khong can H1', 'Dung 1 H1', 'It nhat 2 H1', 'Khong gioi han'], correct_index: 1 },
      ],
    },
  ]);

  console.log('✅ Đã insert sections, lessons và quiz questions');

  // ─── Insert Enrollments ──────────────────────────────────────────────────────
  const insertEnrollment = db.prepare('INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)');
  const enrollments = [
    [student1.id, course1.id], [student1.id, course2.id], [student1.id, course5.id],
    [student2.id, course1.id], [student2.id, course3.id], [student2.id, course5.id],
    [student3.id, course2.id], [student3.id, course4.id], [student3.id, course6.id],
    [student4.id, course1.id], [student4.id, course5.id], [student4.id, course8.id],
  ];
  db.transaction((list) => { for (const [uid, cid] of list) insertEnrollment.run(uid, cid); })(enrollments);
  console.log(`✅ Đã insert ${enrollments.length} enrollments`);

  // ─── Insert Orders & Order Items ─────────────────────────────────────────────
  const insertOrder = db.prepare("INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, 'paid', 'demo')");
  const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, course_id, price) VALUES (?, ?, ?)');
  db.transaction(() => {
    const o1 = insertOrder.run(student1.id, 299000 + 499000);
    insertOrderItem.run(o1.lastInsertRowid, course1.id, 299000);
    insertOrderItem.run(o1.lastInsertRowid, course2.id, 499000);

    const o2 = insertOrder.run(student2.id, 299000 + 349000);
    insertOrderItem.run(o2.lastInsertRowid, course1.id, 299000);
    insertOrderItem.run(o2.lastInsertRowid, course3.id, 349000);

    const o3 = insertOrder.run(student3.id, 499000 + 199000 + 599000);
    insertOrderItem.run(o3.lastInsertRowid, course2.id, 499000);
    insertOrderItem.run(o3.lastInsertRowid, course4.id, 199000);
    insertOrderItem.run(o3.lastInsertRowid, course6.id, 599000);

    const o4 = insertOrder.run(student4.id, 299000 + 199000);
    insertOrderItem.run(o4.lastInsertRowid, course1.id, 299000);
    insertOrderItem.run(o4.lastInsertRowid, course8.id, 199000);
  })();
  console.log('✅ Đã insert orders & order_items');

  // ─── Insert Wallet Transactions ──────────────────────────────────────────────
  const insertWalletTx = db.prepare("INSERT INTO wallet_transactions (user_id, amount, type, status, description) VALUES (?, ?, ?, 'success', ?)");
  db.transaction(() => {
    insertWalletTx.run(instructor1.id, 299000 * 0.7, 'income', 'Doanh thu: Lap trinh Python tu co ban den nang cao');
    insertWalletTx.run(instructor1.id, 299000 * 0.7, 'income', 'Doanh thu: Lap trinh Python tu co ban den nang cao');
    insertWalletTx.run(instructor1.id, 299000 * 0.7, 'income', 'Doanh thu: Lap trinh Python tu co ban den nang cao');
    insertWalletTx.run(instructor1.id, 499000 * 0.7, 'income', 'Doanh thu: JavaScript Fullstack - React & Node.js');
    insertWalletTx.run(instructor1.id, 499000 * 0.7, 'income', 'Doanh thu: JavaScript Fullstack - React & Node.js');
    insertWalletTx.run(instructor2.id, 349000 * 0.7, 'income', 'Doanh thu: Thiet ke UI/UX chuyen nghiep voi Figma');
    insertWalletTx.run(instructor2.id, 199000 * 0.7, 'income', 'Doanh thu: Tieng Anh giao tiep thuc chien B1-B2');
    insertWalletTx.run(instructor1.id, 599000 * 0.7, 'income', 'Doanh thu: Data Science voi Python - Machine Learning co ban');
    insertWalletTx.run(instructor2.id, 199000 * 0.7, 'income', 'Doanh thu: Marketing Online - SEO va Quang cao Google Ads');
    insertWalletTx.run(student1.id, 1000000, 'deposit', 'Nap tien vao vi');
    insertWalletTx.run(student1.id, -(299000 + 499000), 'payment', 'Thanh toan don hang');
    insertWalletTx.run(student2.id, 700000, 'deposit', 'Nap tien vao vi');
    insertWalletTx.run(student2.id, -(299000 + 349000), 'payment', 'Thanh toan don hang');
  })();
  console.log('✅ Đã insert wallet_transactions');

  // ─── Insert Reviews ───────────────────────────────────────────────────────────
  const insertReview = db.prepare('INSERT OR IGNORE INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)');
  db.transaction(() => {
    insertReview.run(student1.id, course1.id, 5, 'Khoa hoc rat hay, giang vien giai thich ro rang, de hieu. Highly recommend!');
    insertReview.run(student1.id, course2.id, 5, 'Xuat sac! Noi dung bao gom day du tu frontend den backend. Project cuoi khoa rat thuc te.');
    insertReview.run(student2.id, course1.id, 4, 'Khoa hoc tot, phu hop cho nguoi moi. Mot so bai giai thich hoi nhanh nhung nhin chung rat tot.');
    insertReview.run(student2.id, course3.id, 5, 'Figma qua xin! Sau khoa hoc nay toi da tu tin thiet ke giao dien cho du an ca nhan.');
    insertReview.run(student3.id, course2.id, 4, 'Noi dung React rat chat luong. Phan Node.js co the chi tiet hon mot chut nhung overall rat tot.');
    insertReview.run(student3.id, course4.id, 5, 'Khoa hoc tieng Anh thuc te nhat toi tung hoc. Sau 2 thang toi da tu tin hon khi giao tiep.');
    insertReview.run(student4.id, course1.id, 5, 'Bat dau tu zero, sau khoa hoc da co the viet script Python de tu dong hoa cong viec. Tuyet voi!');
    insertReview.run(student4.id, course8.id, 4, 'Kien thuc SEO va Google Ads rat thuc te. Da ap dung duoc ngay cho website cua minh.');
  })();
  console.log('✅ Đã insert reviews');

  // ─── Insert Wishlists ─────────────────────────────────────────────────────────
  const insertWishlist = db.prepare('INSERT OR IGNORE INTO wishlists (user_id, course_id) VALUES (?, ?)');
  db.transaction(() => {
    insertWishlist.run(student1.id, course6.id);
    insertWishlist.run(student1.id, course3.id);
    insertWishlist.run(student2.id, course2.id);
    insertWishlist.run(student2.id, course4.id);
    insertWishlist.run(student3.id, course8.id);
    insertWishlist.run(student4.id, course2.id);
    insertWishlist.run(student4.id, course6.id);
  })();
  console.log('✅ Đã insert wishlists');

  // ─── Insert Coupons ───────────────────────────────────────────────────────────
  const insertCoupon = db.prepare("INSERT INTO coupons (code, description, discount_type, discount_value, max_discount, min_order_amount, usage_limit, valid_from, valid_to, status) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+30 days'), 'active')");
  db.transaction(() => {
    insertCoupon.run('WELCOME20', 'Giam 20% cho nguoi dung moi', 'percent', 20, 100000, 100000, 100);
    insertCoupon.run('SAVE50K', 'Giam 50,000d cho don tu 200,000d', 'fixed', 50000, null, 200000, 200);
    insertCoupon.run('SUMMER30', 'Khuyen mai he - giam 30%', 'percent', 30, 150000, 150000, 50);
    insertCoupon.run('FLASHSALE', 'Flash sale giam 100,000d', 'fixed', 100000, null, 300000, 30);
  })();
  console.log('✅ Đã insert coupons');

  // ─── Insert Notifications ─────────────────────────────────────────────────────
  const insertNotif = db.prepare('INSERT INTO notifications (user_id, target_role, title, content, type, link, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)');
  db.transaction(() => {
    insertNotif.run(null, null, 'Chao mung den voi CourseDemy!', 'CourseDemy la nen tang hoc truc tuyen voi hang tram khoa hoc chat luong cao. Bat dau hanh trinh hoc tap cua ban ngay hom nay!', 'system', '/index.html', admin.id);
    insertNotif.run(null, null, 'Flash Sale cuoi tuan - Giam den 30%!', 'Nhap ma SUMMER30 de nhan uu dai 30% cho tat ca khoa hoc. Uu dai co han, dung bo lo!', 'promotion', '/index.html', admin.id);
    insertNotif.run(null, 'instructor', 'Huong dan tao khoa hoc hieu qua', 'Xem huong dan day du ve cach tao noi dung khoa hoc hap dan, tu thiet ke bai giang den quay video chuyen nghiep.', 'system', '/instructor.html', admin.id);
    insertNotif.run(student1.id, null, 'Ban da dang ky thanh cong khoa hoc Python', 'Khoa hoc "Lap trinh Python tu co ban den nang cao" da duoc kich hoat. Bat dau hoc ngay!', 'enrollment', '/learn.html?courseId=' + course1.id, admin.id);
    insertNotif.run(student1.id, null, 'Khoa hoc moi cua ban da san sang', 'JavaScript Fullstack da duoc kich hoat trong tai khoan. Chuc ban hoc tot!', 'enrollment', '/learn.html?courseId=' + course2.id, admin.id);
    insertNotif.run(instructor1.id, null, 'Ban co doanh thu moi!', 'Co 3 hoc vien moi dang ky khoa hoc Python cua ban. Tong doanh thu hom nay: 627,900d', 'income', '/instructor-stats.html', admin.id);
    insertNotif.run(instructor2.id, null, 'Danh gia moi cho khoa hoc cua ban', 'Khoa hoc "Thiet ke UI/UX voi Figma" vua nhan duoc danh gia 5 sao. Tiep tuc phat huy!', 'review', '/instructor-stats.html', admin.id);
  })();
  console.log('✅ Đã insert notifications');

  // ─── Insert Lesson Progress ───────────────────────────────────────────────────
  const course1Lessons = db.prepare('SELECT l.id FROM lessons l JOIN sections s ON l.section_id = s.id WHERE l.course_id = ? ORDER BY l.position ASC LIMIT 5').all(course1.id);
  if (course1Lessons.length > 0) {
    const insertProgress = db.prepare("INSERT OR IGNORE INTO lesson_progress (user_id, lesson_id, course_id, completed, is_completed, completed_at) VALUES (?, ?, ?, 1, 1, datetime('now'))");
    db.transaction(() => {
      for (const lesson of course1Lessons) {
        insertProgress.run(student1.id, lesson.id, course1.id);
        insertProgress.run(student2.id, lesson.id, course1.id);
      }
      const course2Lessons = db.prepare('SELECT l.id FROM lessons l JOIN sections s ON l.section_id = s.id WHERE l.course_id = ? ORDER BY l.position ASC LIMIT 3').all(course2.id);
      for (const lesson of course2Lessons) {
        insertProgress.run(student3.id, lesson.id, course2.id);
      }
    })();
    console.log('✅ Đã insert lesson_progress');
  }

  // ─── Q&A ──────────────────────────────────────────────────────────────────────
  const firstLesson = db.prepare('SELECT id FROM lessons WHERE course_id = ? ORDER BY position ASC LIMIT 1').get(course1.id);
  if (firstLesson) {
    const insertQ = db.prepare('INSERT INTO lesson_questions (lesson_id, course_id, user_id, title, content, is_resolved) VALUES (?, ?, ?, ?, ?, ?)');
    const insertA = db.prepare('INSERT INTO lesson_answers (question_id, user_id, content, is_instructor_answer) VALUES (?, ?, ?, ?)');
    db.transaction(() => {
      const q1 = insertQ.run(firstLesson.id, course1.id, student1.id, 'Su khac biet giua list va tuple trong Python la gi?', 'Toi da doc tai lieu nhung van chua hieu ro khi nao nen dung list va khi nao nen dung tuple. Nho giang vien giai thich them a.', 1);
      insertA.run(q1.lastInsertRowid, instructor1.id, 'Cau hoi rat hay! List la mutable (co the thay doi) con Tuple la immutable (khong thay doi). Dung list khi ban can them/xoa/sua phan tu. Dung tuple khi du lieu co dinh, vi du toa do (x, y), RGB (255, 0, 0). Tuple cung nhanh hon list va co the dung lam key cua dictionary.', 1);
      const q2 = insertQ.run(firstLesson.id, course1.id, student4.id, 'Python 3.11 co gi moi so voi 3.10?', 'Toi dang dung Python 3.11, khong biet co cu phap nao moi can luu y khong a?', 0);
      const q3 = insertQ.run(firstLesson.id, course1.id, student2.id, 'Lam the nao de chay Python tren Windows?', 'Toi cai Python roi nhung khi go python trong cmd thi bi loi. Nho moi nguoi ho tro a.', 1);
      insertA.run(q3.lastInsertRowid, instructor1.id, 'Ban can them Python vao PATH cua Windows. Khi cai Python, tick vao o "Add Python to PATH" la duoc. Neu da cai roi thi uninstall va cai lai nhe!', 1);
      insertA.run(q3.lastInsertRowid, student1.id, 'Ban cung co the dung lenh py thay vi python tren Windows, thuong hoat dong tot hon.', 0);
    })();
    console.log('✅ Đã insert Q&A');
  }

  // ─── Withdrawal Requests ──────────────────────────────────────────────────────
  const insertWithdrawal = db.prepare("INSERT INTO withdrawal_requests (instructor_id, amount, bank_name, account_number, account_holder, status) VALUES (?, ?, ?, ?, ?, ?)");
  db.transaction(() => {
    insertWithdrawal.run(instructor1.id, 1000000, 'Vietcombank', '1234567890', 'TRAN THI MINH ANH', 'approved');
    insertWithdrawal.run(instructor1.id, 500000, 'Techcombank', '0987654321', 'TRAN THI MINH ANH', 'pending');
    insertWithdrawal.run(instructor2.id, 300000, 'MB Bank', '1122334455', 'LE VAN HUNG', 'pending');
  })();
  console.log('✅ Đã insert withdrawal_requests');

  // ─── Tổng kết ─────────────────────────────────────────────────────────────────
  const counts = {
    users:          db.prepare('SELECT COUNT(*) AS c FROM users').get().c,
    categories:     db.prepare('SELECT COUNT(*) AS c FROM categories').get().c,
    courses:        db.prepare('SELECT COUNT(*) AS c FROM courses').get().c,
    sections:       db.prepare('SELECT COUNT(*) AS c FROM course_sections').get().c,
    lessons:        db.prepare('SELECT COUNT(*) AS c FROM lessons').get().c,
    quiz_questions: db.prepare('SELECT COUNT(*) AS c FROM quiz_questions').get().c,
    enrollments:    db.prepare('SELECT COUNT(*) AS c FROM enrollments').get().c,
    reviews:        db.prepare('SELECT COUNT(*) AS c FROM reviews').get().c,
    orders:         db.prepare('SELECT COUNT(*) AS c FROM orders').get().c,
    coupons:        db.prepare('SELECT COUNT(*) AS c FROM coupons').get().c,
    notifications:  db.prepare('SELECT COUNT(*) AS c FROM notifications').get().c,
    wishlists:      db.prepare('SELECT COUNT(*) AS c FROM wishlists').get().c,
  };

  console.log('\n📊 Tổng kết:');
  for (const [table, count] of Object.entries(counts)) {
    console.log(`   ${table.padEnd(16)}: ${count} records`);
  }
  console.log('\n🎉 Seed hoàn tất!\n');
  console.log('📌 Tài khoản demo:');
  console.log('   Admin      : admin@coursedemy.com / admin123');
  console.log('   Instructor1: instructor1@example.com / 123456');
  console.log('   Instructor2: instructor2@example.com / 123456');
  console.log('   Student1   : student1@example.com / 123456');
  console.log('   Student2   : student2@example.com / 123456');
  console.log('   Student3   : student3@example.com / 123456');
  console.log('   Student4   : student4@example.com / 123456');
}

seed().catch((err) => {
  console.error('❌ Lỗi khi seed:', err);
  process.exit(1);
});
