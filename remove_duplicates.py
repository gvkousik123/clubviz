#!/usr/bin/env python3
"""
Script to find and remove exact duplicate rows from CSV files.
This script will:
1. Read the CSV file
2. Identify exact duplicate rows
3. Remove duplicates while keeping the first occurrence
4. Save the cleaned data to a new file
5. Report statistics about duplicates found
"""

import pandas as pd
import sys
from pathlib import Path

def remove_duplicates_from_csv(input_file, output_file=None):
    """
    Remove exact duplicate rows from a CSV file.
    
    Args:
        input_file (str): Path to the input CSV file
        output_file (str, optional): Path to save cleaned CSV. If None, creates a new file with '_cleaned' suffix
    
    Returns:
        dict: Statistics about the operation
    """
    try:
        # Read the CSV file
        print(f"Reading CSV file: {input_file}")
        df = pd.read_csv(input_file)
        
        # Get initial statistics
        initial_rows = len(df)
        print(f"Initial number of rows: {initial_rows}")
        
        # Find duplicates before removing them
        duplicates = df.duplicated(keep=False)
        duplicate_rows = df[duplicates]
        
        if len(duplicate_rows) > 0:
            print(f"\nFound {len(duplicate_rows)} duplicate rows:")
            print("=" * 80)
            print(duplicate_rows.to_string(index=False))
            print("=" * 80)
        else:
            print("\nNo duplicate rows found!")
        
        # Remove duplicates (keep first occurrence)
        df_cleaned = df.drop_duplicates(keep='first')
        
        # Get final statistics
        final_rows = len(df_cleaned)
        duplicates_removed = initial_rows - final_rows
        
        # Create output filename if not provided
        if output_file is None:
            input_path = Path(input_file)
            output_file = input_path.parent / f"{input_path.stem}_cleaned{input_path.suffix}"
        
        # Save cleaned data
        df_cleaned.to_csv(output_file, index=False)
        
        # Print statistics
        print(f"\nDuplicate Removal Statistics:")
        print(f"- Initial rows: {initial_rows}")
        print(f"- Final rows: {final_rows}")
        print(f"- Duplicates removed: {duplicates_removed}")
        print(f"- Cleaned file saved as: {output_file}")
        
        return {
            'initial_rows': initial_rows,
            'final_rows': final_rows,
            'duplicates_removed': duplicates_removed,
            'output_file': str(output_file)
        }
        
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found!")
        return None
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return None

def find_duplicate_details(input_file):
    """
    Analyze and display detailed information about duplicates.
    
    Args:
        input_file (str): Path to the input CSV file
    """
    try:
        df = pd.read_csv(input_file)
        
        # Find all duplicated rows (including first occurrences)
        duplicated_mask = df.duplicated(keep=False)
        
        if not duplicated_mask.any():
            print("No duplicates found in the file.")
            return
        
        # Get duplicate groups
        duplicate_groups = df[duplicated_mask].groupby(df.columns.tolist())
        
        print("Detailed Duplicate Analysis:")
        print("=" * 80)
        
        for group_values, group_df in duplicate_groups:
            print(f"\nDuplicate group (appears {len(group_df)} times):")
            print("-" * 40)
            print(group_df.iloc[0].to_string())
            print(f"Row indices: {group_df.index.tolist()}")
        
        print("=" * 80)
        
    except Exception as e:
        print(f"Error analyzing duplicates: {str(e)}")

if __name__ == "__main__":
    # Default file path
    default_file = "lead - mckesson_175_linkedins.csv"
    
    # Check if file path is provided as command line argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        input_file = default_file
    
    # Check if file exists
    if not Path(input_file).exists():
        print(f"File '{input_file}' not found!")
        print("Usage: python remove_duplicates.py [csv_file_path]")
        sys.exit(1)
    
    # Analyze duplicates first
    print("STEP 1: Analyzing duplicates...")
    find_duplicate_details(input_file)
    
    print("\n" + "="*80)
    print("STEP 2: Removing duplicates...")
    
    # Remove duplicates
    result = remove_duplicates_from_csv(input_file)
    
    if result:
        print("\nOperation completed successfully!")
    else:
        print("\nOperation failed!")
        sys.exit(1)