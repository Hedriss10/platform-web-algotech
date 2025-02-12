import React from "react";

/**
 * Home component.
 *
 * This component renders the main content area of the application,
 * including a page title, breadcrumb navigation, and a section for
 * displaying data tables. It utilizes the Simple DataTables library
 * to convert tables into interactive and sortable data tables.
 *
 * @returns {JSX.Element} The main content area with data tables.
 */

const Home = () => {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Data Tables</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">Tables</li>
            <li className="breadcrumb-item active">Data</li>
          </ol>
        </nav>
      </div>
      {/* End Page Title */}
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Datatables</h5>
                <p>
                  Add lightweight datatables to your project using the{" "}
                  <a
                    href="https://github.com/fiduswriter/Simple-DataTables"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Simple DataTables
                  </a>{" "}
                  library. Just add <code>.datatable</code> class name to any
                  table you wish to convert into a datatable. Check for{" "}
                  <a
                    href="https://fiduswriter.github.io/simple-datatables/demos/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    more examples
                  </a>
                  .
                </p>
                {/* Table with stripped rows */}
                <table className="table datatable">
                  <thead>
                    <tr>
                      <th>
                        <b>N</b>ame
                      </th>
                      <th>Ext.</th>
                      <th>City</th>
                      <th data-type="date" data-format="YYYY/DD/MM">
                        Start Date
                      </th>
                      <th>Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Unity Pugh</td>
                      <td>9958</td>
                      <td>Curicó</td>
                      <td>2005/02/11</td>
                      <td>37%</td>
                    </tr>
                  </tbody>
                </table>
                {/* End Table with stripped rows */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
