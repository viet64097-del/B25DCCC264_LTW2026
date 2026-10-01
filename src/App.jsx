import { use, useMemo,useState } from "react";
import StudentList from "./StudentList";

const initialStudents = [
    { id: 1, name: "Nguyen Van A",score : 8.5, class : "CNTT1"},
    { id: 2, name: "Nguyen Van B", score: 7, class: "CNTT2"},
    { id: 3, name: "Tran Van C", score: 9, class: "CNTT1"},
];

const App = () => {
    const [students,setStudents] = useState(initialStudents);
    const [filter, setFilter] = useState("all");
    const [form, setForm] = useState({name:"",score: "",className:""});
    const [error, setError] = useState("");

    const visibleStudents = useMemo(() => {
        if (filter === "excellent") return students.filter(({score}) => score >= 8);
        if (filter === "failed") return students.filter(({score}) => score < 5);
        return students;
     }, [students,filter]);

    const averageScore = students.length 
        ? (students.reduce((total, {score}) => total + score,0) / students.length).toFixed(1)
        : "0.0";


        const handleChange = ({target: {name,value}}) => {
            setForm((currentForm) => ({...currentForm, [name]:value}));
        };

        const handleAddStudent = (event) => {
            event.preventDefault();
            const {name,score,className} = form;
            const trimmedName = name.trim();
            const trimmedClass = className.trim();
            const numericScore = Number(score);
        
            if (!trimmedName || !trimmedClass || score === "") {
                setError("Vui lòng nhập đẩy đủ thông tin.");
                return;
            }

            if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore >10) {
                setError("Điểm phải là số từ 0 đến 10.");
                return;
            }

            const newStudent = {
                id: Date.now(),
                name: trimmedName,
                score: numericScore,
                class: trimmedClass,
            };
            setStudents((currentStudents) => [...currentStudents,newStudent]);
            setForm({name: "", score: "",className: ""});
            setError("");
        };
    
    const handleDeleteStudent = (studentId) => {
        setStudents((currentStudents) => currentStudents.filter(({id}) => id !== studentId));
    };

    return (
        <main className = "page-shell">
            <header className = "page-header">
                <div>
                    <h1>Quản lý điểm sinh viên.</h1>
                    <p className = "subtitle">Theo dõi sinh viên.</p>
                </div>
                <div className = "header-mark" aria-hidden = "true">SV</div>
            </header>

            <section className = "stats-grid" aria-label = "Thong ke lop">
                <article className="stat-card">
                    <span className = "stat-label">Tổng sinh viên:</span>
                    <strong>{students.length}</strong>
                    <span className = "stat-note">Trong danh sách hiện tại:</span>
                </article>
                <article className = "stat-card accent-card">
                    <span className = "stat-label">Điểm trung bình</span>
                    <strong>{averageScore}</strong>
                    <span className = "stat-note">Thang điểm 10</span>
                </article>
            </section>

            <section className = "panel">
                <div className = "section-heading">
                    <div>
                        <p className = "eyebrow">THÔNG TIN SINH VIÊN</p>
                        <h2>Thêm sinh viên</h2>
                    </div>
                    <span className = "step-number">01</span>
                </div>
                <form className = "student-form" onSubmit = {handleAddStudent} noValidate>
                    <label>
                        Họ và tên
                        <input name = "name" value = {form.name} onChange = {handleChange} placeholder="Vi du: Hoang Viet"></input>
                    </label>
                    <label>
                        Điểm số
                        <input name = "score" type = "number" min = "0" max = "10" step = "0.1" value = {form.score} onChange = {handleChange} placeholder="0-10"></input>
                    </label>
                    <label>
                        Lớp
                        <input name = "className" value = {form.className} onChange = {handleChange} placeholder="Vi du: CNTT1"></input>
                    </label>
                    <button class = "primary-button" type = "submit">Thêm sinh viên</button>
                </form>
                {error && <p className = "error-message" role = "alert">{error}</p>}
            </section>

            <section className = "panel list-panel">
                <div className = "list-toolbar">
                    <div className = "section-heading compact-heading">
                        <div>
                            <p className = "eyebrow">Danh sách lớp</p>
                            <h2>Sinh viên <span className = "count-pill">{visibleStudents.length}</span></h2>
                        </div>
                    </div>
                    <label className = "filter-control">
                        <span>Lọc kết quả</span>
                        <select value = {filter} onChange={({target: {value}}) => setFilter(value)}>
                            <option value = "all">Tất cả sinh viên</option>
                            <option value = "excellent">Giỏi</option>
                            <option value = "failed">Trượt</option>
                        </select>
                    </label>
                </div>
                <StudentList students = {visibleStudents} onDelete = {handleDeleteStudent} />
            </section>
        </main>
    );
};

export default App;