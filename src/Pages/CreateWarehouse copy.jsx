import WarehouseHeader from "../components/WarehouseHeader";
import "./CreateWarehouse.css";

export default function CreateWarehouse() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Warehouse form submitted");
  };

  return (
    <div className="warehouse-page">
      {/* ✅ PAGE HEADER */}
      <WarehouseHeader />

      {/* ✅ FORM CARD */}
      <div className="warehouse-container">
        <h2>Create Warehouse</h2>

        <form className="warehouse-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Warehouse Code</label>
              <input type="text" required />
            </div>

            <div>
              <label>Warehouse Type</label>
              <select>
                <option value="">Select</option>
                <option>MAIN</option>
                <option>SUB</option>
              </select>
            </div>

            <div>
              <label>Owner Type</label>
              <select>
                <option value="">Select</option>
                <option>COMPANY</option>
                <option>THIRD_PARTY</option>
              </select>
            </div>

            <div>
              <label>Aggregator ID</label>
              <input type="text" placeholder="UUID" />
            </div>

            <div className="full">
              <label>Address</label>
              <textarea rows="2"></textarea>
            </div>

            <div>
              <label>State</label>
              <input type="text" />
            </div>

            <div>
              <label>District</label>
              <input type="text" />
            </div>

            <div>
              <label>Pincode</label>
              <input type="text" />
            </div>

            <div>
              <label>Latitude</label>
              <input type="number" step="any" />
            </div>

            <div>
              <label>Longitude</label>
              <input type="number" step="any" />
            </div>

            <div>
              <label>Contact Person Name</label>
              <input type="text" />
            </div>

            <div>
              <label>Contact Mobile</label>
              <input type="text" />
            </div>

            <div>
              <label>Email ID</label>
              <input type="email" />
            </div>

            <div>
              <label>Warehouse Status</label>
              <select>
                <option>ACTIVE</option>
                <option>INACTIVE</option>
              </select>
            </div>

            <div className="full">
              <label>Remarks</label>
              <textarea rows="2"></textarea>
            </div>
          </div>

          <div className="actions">
            <button type="submit">Save Warehouse</button>
          </div>
        </form>
      </div>
    </div>
  );
}
