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
import { useNavigate } from 'react-router-dom';

window.Buffer = Buffer;
const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [username, setUsername] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'add', 'edit', or 'delete'
    const [selectedProduct, setSelectedProduct] = useState(null); // For edit or delete
    const [errors, setErrors] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [query, setQuery] = useState('');
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

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Handle search form submission
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form reload
        try {
            const response = await axios.get(`/employee/search?q=${query}`);
            setProducts(response.data); // Update products with fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTransactions = async (rowData) => {
        try {
            const response = await axios.get(`/employee/transactions/${rowData._id}`);
            setTransactions(response.data);
            setLoading(false);
        } catch (err) {
            setErrors(err.message);
            setLoading(false);
        }
    };

    const handleResetPassword = async (rowData) => {
        try {

                await axios.put(`/employee/reset/${rowData._id}`);
                 // Refresh the data
                alert('Password reset successfully!');
            
        } catch (error) {
            console.error('Error resetting password:', error);
        }
        fetchProducts();
    };

    const confirmResetPassword = (rowData) => {
         // Set the user to be reset
        confirmDialog({
            message: `Are you sure you want to reset the password for ${rowData.username}?`,
            header: 'Reset Password Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleResetPassword(rowData), // Call the reset handler on confirmation
            reject: () => console.log('ok'), // Reset the state if rejected
        });
    };

    const handleSave = async () => {
        if (dialogType === 'add') {
            // Call backend API to add a new user
            try {
                await axios.post('/employee/new', selectedProduct);
                setShowDialog(false);
            } catch (error) {
                console.log("Adding User failed:", error.response.data);
                setErrors(error.response.data.errors || {});
            };
            
        } else if (dialogType === 'edit') {
            // Call backend API to update the user
            try {
                await axios.put(`/employee/update/${selectedProduct._id}`, selectedProduct);
                setShowDialog(false);
            } catch (error) {
                console.log("Editing User failed:", error.response.data);
                setErrors(error.response.data.errors || {});
            }
        }
        // Refresh data
        fetchProducts();
        
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const formattedDate = date.toLocaleDateString(); // Format as MM/DD/YYYY or similar based on locale
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as HH:MM
        return { formattedDate, formattedTime };
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
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const actionsTemplate = (rowData) => {
        return (
            
            <div className="actions-container">
            {/* View transactions */}
            <button
                className="btn btn-success"
                onClick={() => {
                    setDialogType('view');
                    fetchTransactions(rowData);
                    setShowDialog(true);
                }}
                title="View transactions"
            >
                <i className="pi pi-eye"></i>
            </button>
        
            {/* Edit employee */}
            <button
                className="btn btn-primary"
                onClick={() => {
                    setDialogType('edit');
                    console.log('Editing product:', rowData);
                    setSelectedProduct(rowData);
                    setShowDialog(true);
                }}
                title="Edit employee"
            >
                <i className="pi pi-file-edit"></i>
            </button>
        
            {/* Delete employee */}
            <button
                className="btn btn-danger"
                onClick={() => {
                    setDialogType('delete');
                    setSelectedProduct(rowData);
                    setShowDialog(true);
                }}
                title="Delete employee"
            >
                <i className="pi pi-trash"></i>
            </button>
        
            {/* Reset password */}
            <button
                className="btn btn-warning"
                onClick={() => confirmResetPassword(rowData)}
                title="Reset password"
            >
                <i className="pi pi-refresh"></i>
            </button>
        </div>
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
        <div className="min-h-screen bg-primaryColor w-full py-2 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto py-6 text-textColor flex items-center justify-center flex-col">
        <div className="w-[70%] flex items-center justify-center pr-20">
            <img
                src="/rewardhub-high-resolution-logo__2_-removebg-preview-2.png"
                alt="logo"
                className="w-[100%]"
            />
        </div>
        <div className="dashboard text-center p-4">
            <h1 className="text-3xl font-bold text-center mb-4 text-TextColor">Manage employees</h1>
            <div className="flex justify-between items-center mb-6">
                {/* Home Button */}
                <button
                    onClick={() => navigate('/change-password')}
                    className="bg-btnColor text-white px-4 py-2 rounded-lg hover:bg-[#0c7810] transition-all duration-300"
                >
                    Change password
                </button>

                {/* Logout Button */}
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300" onClick={confirmLogout}>
                    Logout <i className="pi pi-sign-out"></i>
                </button>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                style={{
                    width: '50%', // Set consistent width
                    borderRadius: '8px', // Rounded corners
                }}
                className="custom-confirm-dialog"
            />
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
                        Add New Employee <i className="pi pi-plus"></i>
                    </button>
                </div>
                <div>

            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search for employee..."
                    style={{
                        padding: '8px',
                        width: '300px',
                        marginRight: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        height: '39px',
                    }}
                />
                <button
                    className="btn btn-success mb-3"
                >
                    Search
                </button>
            </form>
        </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    
                    <DataTable value={products} responsiveLayout="scroll">
                        <Column className="p-2" field="username" header="Username"></Column>
                        <Column field="firstname" header="First name"></Column>
                        <Column field="lastname" header="Last name"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="phonenumber" header="Phone Number"></Column>
                        <Column field="department" header="Department"></Column>
                        <Column field="points" header="Points"></Column>
                        <Column
                            header="Actions"
                            body={(rowData) => actionsTemplate(rowData)}
                            className="action-column"
                            headerStyle={{textAlign: 'center',
                                paddingLeft: '3em',
                            }}
                            style={{
                               
                                width: '11em'
                             }}
                        ></Column>
                    </DataTable>
                    
                )}
            </div>
</div>
</div>
            {/* Dialog Component */}
            <Dialog
                className="custom-dialog"
                header={dialogType === 'add' ? 'Add Employee' : dialogType === 'edit' ? 'Edit Employee' : dialogType === 'delete' ? 'Confirm Delete' : 'View Transactions'}
                visible={showDialog}
                style={{ width: '50%' }}
                headerStyle={{  
                    padding: '15px 20px', // Add padding directly to the header
                    backgroundColor: '#f5f5f5', // Optional: light background
                    borderBottom: '1px solid #ddd', // Optional: border at the bottom
                    fontSize: '18px', // Optional: font size
                    fontWeight: 'bold', // Optional: make text bold
                    textAlign: 'center', 
                }}
                onHide={() => setShowDialog(false)}
                footer={
                    dialogType === 'delete' ? (
                        <>
                            <Button label="No" icon="pi pi-times" onClick={() => setShowDialog(false)} />
                            <Button label="Yes" icon="pi pi-check" onClick={handleDelete} />
                        </>
                    ) : dialogType === 'edit' || dialogType === 'add' ? (
                        <>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} />
                            <Button label="Save" icon="pi pi-check" onClick={handleSave} />
                        </>
                    ) : null
                }
>
    <div className="dialog-content">
        {dialogType === 'delete' ? (
            <p>Are you sure you want to delete this employee?</p>
        ) : dialogType === 'view' ? (
            <div>
            <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Partner</th>
                        <th>Employee</th>
                        <th>Points</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => {
                        const { formattedDate, formattedTime } = formatDate(transaction.date);
                        return (
                        <tr key={transaction._id}>
                            <td>{transaction.thirdParty || 'N/A'}</td> {/* Rename "thirdParty" to "Partner" */}
                            <td>{transaction.employee}</td>
                            <td>{transaction.points}</td>
                            <td>{transaction.type}</td>
                            <td>{formattedDate}</td>
                            <td>{formattedTime}</td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        ) : (
                <div>
                <label>User name:</label>
                <div className="input-with-icon">
                    <i className="pi pi-user input-icon"></i>
                    <input
                        type="text"
                        className="dialog-input"
                        required
                        value={selectedProduct?.username || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, username: e.target.value }))
                        }
                    />
                    
                </div>
             
                {errors.username && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.username}</p>}
                
                <label>First name:</label>
                <div className="input-with-icon">
                    <i className="pi pi-user input-icon"></i>
                    <input
                        type="text"
                        className="dialog-input"
                        required
                        value={selectedProduct?.firstname || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, firstname: e.target.value }))
                        }
                    />
                    
                </div>
                {errors.firstname && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.firstname}</p>}

                <label>Last name:</label>
                <div className="input-with-icon">
                    <i className="pi pi-user input-icon"></i>
                    <input
                        type="text"
                        className="dialog-input"
                        required
                        value={selectedProduct?.lastname || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, lastname: e.target.value }))
                        }
                    />
                    
                </div>
             
                {errors.lastname && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.lastname}</p>}
                <label>Email:</label>
                <div className="input-with-icon">
                    <i className="pi pi-envelope input-icon"></i>
                    <input
                        type="email"
                        className="dialog-input"
                        required
                        value={selectedProduct?.email || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, email: e.target.value }))
                        }
                    />
                </div>

                {errors.email && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.email}</p>}

                <label>Phone Number:</label>
                <div className="input-with-icon">
                    <i className="pi pi-phone input-icon"></i>
                    <input
                        type="phonenumber"
                        className="dialog-input"
                        required
                        value={selectedProduct?.phonenumber || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, phonenumber: e.target.value }))
                        }
                    />
                </div>

                {errors.phonenumber && <p className="text-red-500 text-sm w-[150px] break-words mt-1">{errors.phonenumber}</p>}

                <label>Department:</label>
                <div className="input-with-icon">
                    <i className="pi pi-sitemap input-icon"></i>
                    <input
                        type="text"
                        className="dialog-input"
                        value={selectedProduct?.department || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, department: e.target.value }))
                        }
                    />
                </div>

                <label>Points:</label>
                <div className="input-with-icon">
                    <i className="pi pi-star input-icon"></i>
                    <input
                        type="number"
                        className="dialog-input"
                        value={selectedProduct?.points || ''}
                        onChange={(e) =>
                            setSelectedProduct((prev) => ({ ...prev, points: e.target.value }))
                        }
                    />
                </div>
            </div>
        )}
    </div>
</Dialog>
        </div>
    );
};

export default Dashboard;