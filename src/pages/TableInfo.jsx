import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { getTableDetails } from '../apis/dashboard';
import { useParams, useNavigate } from 'react-router-dom';
import { MdRefresh, MdArrowBack, MdFilterList, MdSearch, MdDownload, MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdContentCopy } from 'react-icons/md';

function TableInfo() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [copiedField, setCopiedField] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'update', or 'delete'
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState({});

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    fetchTableDetails();
  }, [name]);

  useEffect(() => {
    if (tableData.length > 0) {
      const filtered = tableData.filter(item =>
        Object.values(item).some(val =>
          val !== null && val !== undefined &&
          val.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filtered);
      setTotalRows(filtered.length);
    }
  }, [searchText, tableData]);

  // Reset copied field effect after 2 seconds
  useEffect(() => {
    if (copiedField) {
      const timer = setTimeout(() => {
        setCopiedField(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedField]);

  // Fetch table data from API
  const fetchTableDetails = async () => {
    setLoading(true);
    try {
      const payload = { tableName: name };
      const response = await getTableDetails(payload);
      const data = response?.data || [];
      setTableData(data);
      setFilteredData(data);
      setTotalRows(data.length);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if a value is an image URL
  const isImageUrl = (str) => {
    if (typeof str !== 'string') return false;
    return /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(str) || 
           str.startsWith('data:image/') || 
           str.startsWith('blob:');
  };

  // Open modal for create operation
  const handleCreate = () => {
    // Initialize empty form data based on table structure
    const emptyForm = tableData[0]
      ? Object.keys(tableData[0]).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {})
      : {};

    setFormData(emptyForm);
    setImagePreview({});
    setModalMode('create');
    setShowModal(true);
  };

  // Open modal for update operation
  const handleUpdate = (row) => {
    setSelectedRow(row);
    setFormData({ ...row }); // Copy existing data to form
    
    // Initialize image previews if there are any image fields
    const imageFields = {};
    Object.entries(row).forEach(([key, value]) => {
      if (isImageUrl(value)) {
        imageFields[key] = value;
      }
    });
    setImagePreview(imageFields);
    
    setModalMode('update');
    setShowModal(true);
  };

  // Open delete confirmation
  const handleDelete = (row) => {
    setRowToDelete(row);
    setShowDeleteConfirm(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle file inputs for images
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(prev => ({
        ...prev,
        [name]: previewUrl
      }));
      
      // In a real app, you'd handle file upload here
      // For now, we'll just store the file name
      setFormData({
        ...formData,
        [name]: file.name // In production, you'd likely upload the file and store its URL
      });
    } else {
      // Handle other input types
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you would connect to your API
    try {
      if (modalMode === 'create') {
        // createRecord(formData);
        console.log('Creating:', formData);

        // Optimistic UI update (replace with actual API response)
        setTableData([...tableData, { ...formData, id: Date.now() }]); // Temporary ID
      } else if (modalMode === 'update') {
        // updateRecord(selectedRow.id, formData);
        console.log('Updating:', selectedRow.id, formData);

        // Optimistic UI update (replace with actual API response)
        setTableData(tableData.map(item =>
          item.id === selectedRow.id ? formData : item
        ));
      }

      setShowModal(false);
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Operation failed. Please try again.');
    }
  };

  // Delete confirmation handler
  const confirmDelete = async () => {
    try {
      // deleteRecord(rowToDelete.id);
      console.log('Deleting:', rowToDelete.id);

      // Optimistic UI update (replace with actual API response)
      setTableData(tableData.filter(item => item.id !== rowToDelete.id));

      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete operation failed. Please try again.');
    }
  };

  // Function to copy text to clipboard with visual feedback
  const copyToClipboard = (value, key, rowId) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopiedField(`${key}-${rowId}`);
        console.log('Copied to clipboard:', value);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Render an array as a dropdown select
  const renderArrayAsSelect = (array) => {
    if (!Array.isArray(array) || array.length === 0) return <span>Empty array</span>;
    
    return (
      <select className="bg-gray-50 border border-gray-200 text-gray-700 py-1 px-2 rounded text-sm w-full">
        {array.map((item, index) => (
          <option key={index} value={item?.toString()}>
            {item?.toString()}
          </option>
        ))}
      </select>
    );
  };

  // Dynamically generate columns based on data keys with action buttons
  const columns = tableData[0]
    ? [
      ...Object.keys(tableData[0]).map((key) => ({
        name: key.replace(/_/g, ' ').toUpperCase(),
        selector: (row) => {
          // Check if value is null or undefined
          if (row[key] === null || row[key] === undefined) {
            return <span className="text-gray-400">N/A</span>;
          }
          
          // Get raw value for copying
          let rawValue = '';
          let displayElement = null;
          const fieldId = `${key}-${row.id}`;
          const isCopied = copiedField === fieldId;
          
          // Check if the value is an array
          if (Array.isArray(row[key])) {
            rawValue = JSON.stringify(row[key]);
            displayElement = renderArrayAsSelect(row[key]);
          }
          // Check if the value is an image URL
          else if (isImageUrl(row[key])) {
            rawValue = row[key].toString();
            displayElement = (
              <div className="w-12 h-12 rounded overflow-hidden">
                <img 
                  src={row[key]} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/50?text=Error'}
                />
              </div>
            );
          }
          // Check if the value is a date
          else if (row[key] instanceof Date || (typeof row[key] === 'string' && !isNaN(Date.parse(row[key])))) {
            const date = row[key] instanceof Date ? row[key] : new Date(row[key]);
            // Format date as DD/MM/YYYY
            const formattedDate = date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            rawValue = formattedDate;
            displayElement = <span>{formattedDate}</span>;
          }
          // Handle other data types
          else if (typeof row[key] === 'boolean') {
            rawValue = row[key] ? 'Yes' : 'No';
            displayElement = row[key]
              ? <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-medium">Yes</span>
              : <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">No</span>;
          } else if (typeof row[key] === 'number') {
            rawValue = row[key].toString();
            displayElement = <span className="font-medium">{row[key]}</span>;
          } else {
            rawValue = row[key]?.toString() || 'N/A';
            displayElement = <span>{rawValue}</span>;
          }

          // Return the clickable element with copy function
          return (
            <div className="flex items-center gap-2">
              <div className="flex-grow">{displayElement}</div>
              <button
                className={`p-1 rounded ${isCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(rawValue, key, row.id);
                }}
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <span className="text-xs font-medium">Copied!</span>
                ) : (
                  <MdContentCopy size={16} />
                )}
              </button>
            </div>
          );
        },
        sortable: true,
      })),
      {
        name: 'ACTIONS',
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdate(row)}
              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              title="Edit"
            >
              <MdEdit size={18} />
            </button>
            <button
              onClick={() => handleDelete(row)}
              className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              title="Delete"
            >
              <MdDelete size={18} />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '100px',
      }
    ]
    : [];

  // Custom styles for the DataTable
  const customStyles = {
    table: {
      style: {
        backgroundColor: '#FFFFFF',
        borderSpacing: '0',
      },
    },
    tableWrapper: {
      style: {
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        fontWeight: 'bold',
      },
    },
    headCells: {
      style: {
        color: '#5F6980',
        fontSize: '0.875rem',
        fontWeight: '600',
        letterSpacing: '0.025em',
        padding: '1rem',
        textTransform: 'uppercase',
      },
    },
    cells: {
      style: {
        padding: '1rem',
        borderBottom: '1px solid #F3F4F6',
      },
    },
    rows: {
      style: {
        backgroundColor: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#F5F7FA',
          cursor: 'pointer',
        },
      },
      stripedStyle: {
        backgroundColor: '#FBFBFD',
      },
    },
    pagination: {
      style: {
        borderTop: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        color: '#5F6980',
        padding: '0.75rem',
      },
      pageButtonsStyle: {
        color: '#5E5CE6',
        fill: '#5E5CE6',
        '&:disabled': {
          color: '#B0B7C3',
          fill: '#B0B7C3',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: '#F0F0FD',
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: '#F0F0FD',
        },
      },
    },
    noData: {
      style: {
        padding: '2rem',
        backgroundColor: '#FFFFFF',
        color: '#5F6980',
      },
    },
    progress: {
      style: {
        backgroundColor: '#FFFFFF',
        color: '#5E5CE6',
      },
    },
  };

  // Detect field type for form inputs
  const getFieldType = (key, value) => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) return 'date';
    if (isImageUrl(value)) return 'image';
    if (Array.isArray(value)) return 'array';
    return 'text';
  };

  // Render form field based on data type
  const renderFormField = (key, value) => {
    const fieldType = getFieldType(key, value);
    
    switch (fieldType) {
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={value}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={key} className="ml-2 text-sm text-gray-700">
              {value ? 'Yes' : 'No'}
            </label>
          </div>
        );
      
      case 'date':
        const dateValue = value instanceof Date ? value.toISOString().split('T')[0] : new Date(value).toISOString().split('T')[0];
        return (
          <input
            type="date"
            name={key}
            value={dateValue}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        );
      
      case 'image':
        return (
          <div>
            <input
              type="file"
              name={key}
              onChange={handleInputChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            {(imagePreview[key] || value) && (
              <div className="mt-2 relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={imagePreview[key] || value}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=Image+Preview'}
                />
              </div>
            )}
          </div>
        );
      
      case 'array':
        return (
          <select
            name={key}
            value={value[0] || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            multiple
          >
            {Array.isArray(value) && value.map((item, idx) => (
              <option key={idx} value={item?.toString()}>
                {item?.toString()}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={fieldType}
            name={key}
            value={value}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required={key === 'id'}
            readOnly={modalMode === 'update' && key === 'id'}
          />
        );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="px-6 py-4 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
            >
              <MdArrowBack size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              <span className="text-gray-500 mr-2">Table:</span>
              {name}
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="Search records..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <button
              onClick={fetchTableDetails}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-200"
            >
              <MdRefresh size={20} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              <MdDownload size={20} />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-6">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 mr-4 mb-2">
            <div className="mr-3">
              <div className="text-xs text-gray-500">Total Records</div>
              <div className="text-lg font-bold text-gray-800">{totalRows}</div>
            </div>
          </div>

          {tableData[0] && Object.keys(tableData[0]).length > 0 && (
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 mr-4 mb-2">
              <div className="mr-3">
                <div className="text-xs text-gray-500">Columns</div>
                <div className="text-lg font-bold text-gray-800">{Object.keys(tableData[0]).length}</div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 mb-2">
              <div className="mr-3">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="text-sm font-medium text-gray-800">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          )}

          <div className="ml-auto mb-2">
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              <MdAdd size={20} />
              <span>Create New Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-grow p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            title={
              <div className="py-2 text-lg font-bold text-gray-800 flex items-center">
                <MdFilterList className="text-gray-600 mr-2" size={20} />
                {name} Data
              </div>
            }
            columns={columns}
            data={filteredData}
            progressPending={loading}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            responsive
            highlightOnHover
            striped
            persistTableHead
            customStyles={customStyles}
            progressComponent={
              <div className="p-6 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            }
            noDataComponent={
              <div className="p-10 flex flex-col items-center justify-center text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-lg font-medium">No records found</p>
                <p className="text-sm">Try changing your search criteria or refresh the data</p>
              </div>
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-3 px-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Viewing data for <span className="font-semibold text-indigo-600">{name}</span> table • {totalRows} records found
        </div>
      </div>

      {/* Create/Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Create New' : 'Update'} Record
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData && Object.keys(formData).map((key) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    {renderFormField(key, formData[key])}
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MdSave className="mr-2" size={18} />
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <MdDelete className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this record? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <MdDelete className="mr-2" size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableInfo;