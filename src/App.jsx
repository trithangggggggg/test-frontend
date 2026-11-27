// HOAN_THIEN: dựng bố cục trang và khai báo các route theo đề (Mục 4.1, 4.2, 4.3).
// Xoá đoạn return bên dưới khi bắt đầu làm bài.
export default function App() {
  return (
    <main>
      <header className="App-header">
        <b>OfficeMart Admin</b>
      </header>
      <body>
        <header className="App-header-body">
          <p className="App-title">
            <b>San Pham</b>
          </p>
          <button className="Add-button">Thêm sản phẩm</button>
        </header>

        <table className="Product-table">
          <thead className="Product-table-header">
            <tr>
              <th>Tên</th>
              <th>SKU</th>
              <th>Danh Muc</th>
              <th>Gia</th>
              <th>Ton kho</th>
              <th>Trang thai</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody className="Product-table-body">
            <tr>
              <td>Man hinh</td>
              <td>mon-000</td>
              <td>Man hinh</td>
              <td>360000</td>
              <td>10</td>
              <td className="Product-status">Dang ban</td>
              <td>
                <button className="Edit-button">Sửa</button>
                <button className="Delete-button">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </main>
  );
}
