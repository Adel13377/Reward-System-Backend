import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import './Dashboard.css';
import axios from '../api/axiosInstance';
import { Buffer } from 'buffer';
import { jwtDecode } from 'jwt-decode';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import axi from "axios";
// import { ConfirmDialog } from 'primereact/confirmdialog';
// import { confirmDialog } from 'primereact/confirmdialog';
// import { Dialog } from 'primereact/dialog';

window.Buffer = Buffer;
const Dashboard = () => {
    const [products, setProducts] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [username, setUsername] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'add', 'edit', or 'delete'
    const [selectedProduct, setSelectedProduct] = useState(null); // For edit or delete
    // Fetch data from backend API
    useEffect(() => {
        const abortController = new AbortController(); // Create an AbortController instance
        const signal = abortController.signal; // Extract the signal

        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                    // Decode the token to extract the username
                    const decodedToken = jwtDecode(accessToken);
                    console.log("DECODED TOKEN", JSON.stringify(decodedToken));
                    setUsername(decodedToken.name);
                }
                const response = await axios.get('/employee/all', { signal });
                setProducts(response.data); // Update state with fetched data
            } catch (error) {
                if (signal.aborted) {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => {
            abortController.abort();
        };
    }, []); // Empty dependency array to run on component mount only

    const handleSave = async () => {
        if (dialogType === 'add') {
            // Call backend API to add a new user
            await axios.post('/employee/new', selectedProduct);
        } else if (dialogType === 'edit') {
            // Call backend API to update the user
            await axios.put(`/employee/update/${selectedProduct._id}`, selectedProduct);
        }
        // Refresh data
        fetchProducts();
        setShowDialog(false);
    };

    const handleDelete = async () => {
        // Call backend API to delete the user
        await axios.delete(`/employee/del/${selectedProduct._id}`);
        // Refresh data
        fetchProducts();
        setShowDialog(false);
    };

    const fetchProducts = async () => {
        setLoading(true);
        const response = await axios.get('/employee/all');
        setProducts(response.data);
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.error('No refresh token found');
                return;
            }
            console.log("Refresh token:", refreshToken);
            const response = await axios.delete('/admin/logout', {
                data: { token: refreshToken },
            });
    
            if (response.status === 200) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const actionsTemplate = (rowData) => {
        return (
            <>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setDialogType('view');
                        setSelectedProduct(rowData);
                        setShowDialog(true);
                    }}
                >
                    <i className="pi pi-eye"></i>
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setDialogType('edit');
                        console.log('Editing product:', rowData);
                        setSelectedProduct(rowData);
                        setShowDialog(true);
                    }}
                >
                    <i className="pi pi-file-edit"></i>
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        setDialogType('delete');
                        setSelectedProduct(rowData);
                        setShowDialog(true);
                    }}
                >
                    <i className="pi pi-trash"></i>
                </button>
            </>
        );
    };
    const confirmLogout = () => {
        confirmDialog({
            message: 'Are you sure you want to log out?',
            header: 'Logout Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: handleLogout, // Call handleLogout on confirmation
            reject: () => console.log('Logout cancelled'), // Optional: handle rejection
        });
    };
    return (
        <div className="dashboard text-center p-4">
            <h1>Hello {username}</h1>
            <button className="btn btn-danger mb-3" onClick={confirmLogout}>
                Logout <i className="pi pi-sign-out"></i>
            </button>

            {/* Confirm Dialog */}
            <ConfirmDialog />
            <div className="data-list">
                <div className="add-user">
                    <button
                        className="btn btn-success mb-3"
                        onClick={() => {
                            setDialogType('add');
                            setSelectedProduct(null);
                            setShowDialog(true);
                        }}
                    >
                        Add New User <i className="pi pi-plus"></i>
                    </button>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable value={products} responsiveLayout="scroll">
                        <Column className="p-2" field="name" header="Name"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="department" header="Department"></Column>
                        <Column field="points" header="Points"></Column>
                        <Column
                            header="Actions"
                            body={(rowData) => actionsTemplate(rowData)}
                            className="action-column"
                        ></Column>
                    </DataTable>
                )}
            </div>

            {/* Dialog Component */}
            <Dialog
                header={dialogType === 'add' ? 'Add User' : dialogType === 'edit' ? 'Edit User' : 'Confirm Delete'}
                visible={showDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowDialog(false)}
                footer={
                    dialogType === 'delete' ? (
                        <>
                            <Button label="No" icon="pi pi-times" onClick={() => setShowDialog(false)} />
                            <Button label="Yes" icon="pi pi-check" onClick={handleDelete} />
                        </>
                    ) : (
                        <>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} />
                            <Button label="Save" icon="pi pi-check" onClick={handleSave} />
                        </>
                    )
                }
            >
                {dialogType === 'delete' ? (
                    <p>Are you sure you want to delete this user?</p>
                ) : (
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={selectedProduct?.name || ''}
                            onChange={(e) =>
                                setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={selectedProduct?.email || ''}
                            onChange={(e) =>
                                setSelectedProduct((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />
                         <label>Department:</label>
                        <input
                            type="text"
                            value={selectedProduct?.department || ''}
                            onChange={(e) =>
                                setSelectedProduct((prev) => ({ ...prev, department: e.target.value }))
                            }
                        />
                        <label>Points:</label>
                        <input
                            type="number"
                            value={selectedProduct?.points || ''}
                            onChange={(e) =>
                                setSelectedProduct((prev) => ({ ...prev, points: e.target.value }))
                            }
                        />
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default Dashboard;