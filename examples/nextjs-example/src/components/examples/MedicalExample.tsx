/**
 * MedicalExample Component
 * Demonstrates confidential medical records with FHE
 */

'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  encrypted?: any;
  timestamp: Date;
}

export default function MedicalExample() {
  const [recordType, setRecordType] = useState('');
  const [recordValue, setRecordValue] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const { encrypt, isEncrypting } = useEncryption();

  const handleAddRecord = async () => {
    if (!recordType || !recordValue) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Encrypt the medical record value
      const encrypted = await encrypt(parseInt(recordValue) || 0, 'uint32');

      const newRecord: MedicalRecord = {
        id: Math.random().toString(36).substr(2, 9),
        type: recordType,
        value: recordValue,
        encrypted,
        timestamp: new Date()
      };

      setRecords([newRecord, ...records]);

      // Clear form
      setRecordType('');
      setRecordValue('');
    } catch (err) {
      console.error('Error adding record:', err);
      alert('Failed to add medical record');
    }
  };

  const handleClearRecords = () => {
    if (confirm('Are you sure you want to clear all records?')) {
      setRecords([]);
    }
  };

  return (
    <Card
      title="Confidential Medical Records"
      subtitle="Manage private health information"
    >
      <div className="space-y-6">
        {/* Add Record Form */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Add New Record</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Record Type
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
              >
                <option value="">Select type...</option>
                <option value="Blood Pressure">Blood Pressure (mmHg)</option>
                <option value="Heart Rate">Heart Rate (bpm)</option>
                <option value="Blood Sugar">Blood Sugar (mg/dL)</option>
                <option value="Temperature">Temperature (°F)</option>
                <option value="Weight">Weight (lbs)</option>
              </select>
            </div>

            <Input
              label="Value"
              type="number"
              value={recordValue}
              onChange={(e) => setRecordValue(e.target.value)}
              placeholder="Enter value"
            />

            <Button
              variant="primary"
              onClick={handleAddRecord}
              isLoading={isEncrypting}
              className="w-full"
            >
              Encrypt and Store Record
            </Button>
          </div>
        </div>

        {/* Records List */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800">Encrypted Records</h4>
            {records.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearRecords}
              >
                Clear All
              </Button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No records yet. Add your first medical record above.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {record.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Encrypted
                    </span>
                  </div>

                  <div className="text-xs font-mono bg-white p-2 rounded border border-gray-200 overflow-hidden">
                    <p className="text-gray-500 mb-1">Original: {record.value}</p>
                    <p className="text-gray-700 truncate">
                      Encrypted: {JSON.stringify(record.encrypted).substring(0, 60)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded p-4">
          <h5 className="font-semibold text-purple-800 mb-2">Privacy Features:</h5>
          <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
            <li>Medical data encrypted before storage</li>
            <li>Records remain private on the blockchain</li>
            <li>Access control through smart contracts</li>
            <li>Computations on encrypted health data</li>
            <li>HIPAA-compliant privacy protection</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
