import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import WarehouseHeader from "../components/WarehouseHeader";
import "./CreateWarehouse.css";

export default function EditWarehouse() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState({
    warehouseCode: "",
    warehouseType: "",
    ownerType: "",
    aggregatorId: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
    latitude: "",
    longitude: "",
    contactPerson: "",
    mobile: "",
    email: "",
    status: "ACTIVE",
    remarks: "",
  });

  /* ✅ LOAD DATA FROM TABLE ROW */
  useEffect(() => {
    if (state) {
      setWarehouse({
        warehouseCode: state.warehouseCode || "",
        warehouseType: state.warehouseType || "",
        ownerType: state.ownerType || "",
        aggregatorId: state.aggregatorId || "",
        address: state.address || "",
        state: state.state || "",
        district: state.district || "",
        pincode: state.pincode || "",
        latitude: state.latitude || "",
        longitude: state.longitude || "",
        contactPerson: state.contactPerson || "",
        mobile: state.mobile || "",
        email: state.email || "",
        status: state.status ? "ACTIVE" : "INACTIVE",
        remarks: state.remarks || "",
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Warehouse:", warehouse);
    navigate("/warehouse");
  };

  return (
    <div className="warehouse-page">
      {/* ✅ PAGE HEADER */}
      <WarehouseHeader />

      {/* ✅ FORM CARD */}
      <div className="warehouse-container">
        <h2>Edit Warehouse</h2>

        <form className="warehouse-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Warehouse Code</label>
              <input
                name="warehouseCode"
                value={warehouse.warehouseCode}
                readOnly
              />
            </div>

            <div>
              <label>Warehouse Type</label>
              <select
                name="warehouseType"
                value={warehouse.warehouseType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="MAIN">MAIN</option>
                <option value="SUB">SUB</option>
              </select>
            </div>

            <div>
              <label>Owner Type</label>
              <select
                name="ownerType"
                value={warehouse.ownerType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="COMPANY">COMPANY</option>
                <option value="THIRD_PARTY">THIRD_PARTY</option>
              </select>
            </div>

            <div>
              <label>Aggregator ID</label>
              <input
                name="aggregatorId"
                value={warehouse.aggregatorId}
                onChange={handleChange}
              />
            </div>

            <div className="full">
              <label>Address</label>
              <textarea
                name="address"
                rows="2"
                value={warehouse.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>State</label>
              <input name="state" value={warehouse.state} onChange={handleChange} />
            </div>

            <div>
              <label>District</label>
              <input name="district" value={warehouse.district} onChange={handleChange} />
            </div>

            <div>
              <label>Pincode</label>
              <input name="pincode" value={warehouse.pincode} onChange={handleChange} />
            </div>

            <div>
              <label>Latitude</label>
              <input
                name="latitude"
                value={warehouse.latitude}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Longitude</label>
              <input
                name="longitude"
                value={warehouse.longitude}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Contact Person Name</label>
              <input
                name="contactPerson"
                value={warehouse.contactPerson}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Contact Mobile</label>
              <input name="mobile" value={warehouse.mobile} onChange={handleChange} />
            </div>

            <div>
              <label>Email ID</label>
              <input name="email" value={warehouse.email} onChange={handleChange} />
            </div>

            <div>
              <label>Warehouse Status</label>
              <select name="status" value={warehouse.status} onChange={handleChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="full">
              <label>Remarks</label>
              <textarea
                name="remarks"
                rows="2"
                value={warehouse.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="actions">
            <button type="submit">Update Warehouse</button>
          </div>
        </form>
      </div>
    </div>
  );
}
