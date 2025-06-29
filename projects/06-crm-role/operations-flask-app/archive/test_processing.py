import unittest
import pandas as pd
import os
from processor import process_uploaded_file

class TestProcessing(unittest.TestCase):

    def setUp(self):
        """Set up test data."""
        data = {
            'Item Description': ['CS35 PLUS 1.4T AT'],
            'Engine No.': ['JL478QEP1554523-LS4ABAC10NB016723']
        }
        self.test_df = pd.DataFrame(data)

    def tearDown(self):
        """Clean up after tests."""
        test_filepath = 'test_input.xlsx'
        if os.path.exists(test_filepath):
            os.remove(test_filepath)

    def test_full_processing_pipeline(self):
        """Tests the entire data processing pipeline from reading a sample file to the final output."""
        test_filepath = 'test_input.xlsx'
        # The processor expects headers on the 3rd row, so we add two empty rows
        writer = pd.ExcelWriter(test_filepath, engine='openpyxl')
        self.test_df.to_excel(writer, index=False, sheet_name='Sheet1', startrow=2)
        writer.close()

        # Run the main processing function
        result_df = process_uploaded_file(test_filepath)

        # Assertions
        self.assertFalse(result_df.empty)
        self.assertEqual(len(result_df), 1)
        self.assertEqual(result_df.iloc[0]['Model'], 'CHANGAN CS35 PLUS PRO')
        self.assertEqual(result_df.iloc[0]['Engine'], 'JL478QEP1554523')
        self.assertEqual(result_df.iloc[0]['VIN'], 'LS4ABAC10NB016723')

if __name__ == '__main__':
    unittest.main()
