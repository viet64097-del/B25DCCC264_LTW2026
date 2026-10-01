import StudentItem from './StudentItem.jsx';

const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <div className="empty-state">Không có sinh viên phù hợp với bộ lọc.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Sinh viên</th>
            <th>Lớp</th>
            <th>Điểm số</th>
            <th>Kết quả</th>
            <th><span className="sr-only">Thao tác</span></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentItem key={student.id} student={student} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
