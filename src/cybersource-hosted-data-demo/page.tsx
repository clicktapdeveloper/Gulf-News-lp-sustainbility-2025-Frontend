import React, { useState, useEffect } from 'react';
import { cyberSourceHostedDataService, type CyberSourceHostedPaymentData } from '../lib/cybersource-hosted-data-service';
import CustomButton from '../screens/CustomButton';

const CyberSourceHostedDataDemo: React.FC = () => {
  const [allData, setAllData] = useState<CyberSourceHostedPaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTransactionId, setSearchTransactionId] = useState('');

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading all cybersource_hosted data...');
      const result = await cyberSourceHostedDataService.getAllCyberSourceHostedData();
      
      if (result.success && result.data) {
        setAllData(result.data);
        console.log('Loaded data:', result.data);
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      console.log('Loading summary...');
      const result = await cyberSourceHostedDataService.getCyberSourceHostedSummary();
      
      if (result.success) {
        setSummary(result.summary);
        console.log('Loaded summary:', result.summary);
      } else {
        console.error('Failed to load summary:', result.error);
      }
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const searchByEmail = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching by email:', searchEmail);
      const result = await cyberSourceHostedDataService.getCyberSourceHostedDataByEmail(searchEmail);
      
      if (result.success && result.data) {
        setAllData(result.data);
        console.log('Search results:', result.data);
      } else {
        setError(result.error || 'No data found for this email');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error searching by email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchByTransactionId = async () => {
    if (!searchTransactionId.trim()) {
      setError('Please enter a transaction ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching by transaction ID:', searchTransactionId);
      const result = await cyberSourceHostedDataService.getCyberSourceHostedDataByTransactionId(searchTransactionId);
      
      if (result.success && result.data) {
        setAllData(result.data);
        console.log('Search results:', result.data);
      } else {
        setError(result.error || 'No data found for this transaction ID');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error searching by transaction ID:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    loadSummary();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              CyberSource Hosted Checkout Data Retrieval
            </h1>

            {/* Summary Section */}
            {summary && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.totalPayments}</div>
                    <div className="text-sm text-blue-700">Total Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{summary.successfulPayments}</div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{summary.failedPayments}</div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{summary.uniqueCustomers}</div>
                    <div className="text-sm text-purple-700">Unique Customers</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    Total Amount: {formatCurrency(summary.totalAmount, summary.currency)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Average: {formatCurrency(summary.averageAmount, summary.currency)}
                  </div>
                </div>
              </div>
            )}

            {/* Search Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search by Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Enter customer email"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <CustomButton
                    onClick={searchByEmail}
                    disabled={isLoading}
                    className="px-4 py-2"
                  >
                    Search
                  </CustomButton>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search by Transaction ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTransactionId}
                    onChange={(e) => setSearchTransactionId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <CustomButton
                    onClick={searchByTransactionId}
                    disabled={isLoading}
                    className="px-4 py-2"
                  >
                    Search
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4">
              <CustomButton
                onClick={loadAllData}
                disabled={isLoading}
                className="px-6 py-2"
              >
                {isLoading ? 'Loading...' : 'Load All Data'}
              </CustomButton>
              
              <CustomButton
                onClick={loadSummary}
                disabled={isLoading}
                variant="outline"
                className="px-6 py-2"
              >
                Refresh Summary
              </CustomButton>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Data Display */}
            {allData.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  CyberSource Hosted Payment Data ({allData.length} records)
                </h2>
                
                {allData.map((payment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer Email:</span>
                            <span className="font-medium">{payment.customerEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer Name:</span>
                            <span className="font-medium">{payment.customerFirstName} {payment.customerLastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{formatCurrency(payment.paymentAmount, payment.paymentCurrency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">{payment.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Reference:</span>
                            <span className="font-medium text-sm">{payment.paymentReference}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CyberSource Transaction ID:</span>
                            <span className="font-medium text-sm">{payment.cybersourceTransactionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`font-medium ${payment.paymentStatus === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                              {payment.paymentStatus}
                            </span>
                          </div>
                          {payment.authCode && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Auth Code:</span>
                              <span className="font-medium">{payment.authCode}</span>
                            </div>
                          )}
                          {payment.cardType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Card Type:</span>
                              <span className="font-medium">{payment.cardType}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submitted At:</span>
                            <span className="font-medium text-sm">{formatDate(payment.submittedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Nomination Data */}
                      {payment.nominationData && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Nomination Information</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span className="font-medium">{payment.nominationData.firstName} {payment.nominationData.lastName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">{payment.nominationData.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Company:</span>
                              <span className="font-medium">{payment.nominationData.companyName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Designation:</span>
                              <span className="font-medium">{payment.nominationData.designation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{payment.nominationData.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trade License:</span>
                              <span className="font-medium">{payment.nominationData.tradeLicense}</span>
                            </div>
                            {payment.nominationData.supportingDocument && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Supporting Document:</span>
                                <span className="font-medium text-sm">{payment.nominationData.supportingDocument}</span>
                              </div>
                            )}
                            {payment.nominationData.message && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Message:</span>
                                <span className="font-medium text-sm">{payment.nominationData.message}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isLoading && !error && (
              <div className="text-center py-8">
                <p className="text-gray-500">No cybersource_hosted payment data found.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try submitting a nomination form with cybersource_hosted payment method.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberSourceHostedDataDemo;
