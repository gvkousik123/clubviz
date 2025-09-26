#!/usr/bin/env python3
"""
Simple script to check and remove duplicates from the LinkedIn leads CSV file.
"""

import pandas as pd

def check_and_remove_duplicates():
    # Read the CSV file
    file_path = "lead - mckesson_175_linkedins.csv"
    df = pd.read_csv(file_path)
    
    print(f"Original dataset shape: {df.shape}")
    print(f"Total rows: {len(df)}")
    
    # Check for exact duplicates
    duplicates = df.duplicated()
    num_duplicates = duplicates.sum()
    
    print(f"Number of duplicate rows: {num_duplicates}")
    
    if num_duplicates > 0:
        print(f"\nDuplicate rows found:")
        print("-" * 50)
        # Show the duplicate rows
        duplicate_rows = df[df.duplicated(keep=False)]
        print(duplicate_rows)
        
        # Remove duplicates (keep first occurrence)
        df_cleaned = df.drop_duplicates()
        
        print(f"\nAfter removing duplicates:")
        print(f"New dataset shape: {df_cleaned.shape}")
        print(f"Rows removed: {len(df) - len(df_cleaned)}")
        
        # Save cleaned data
        output_file = "lead - mckesson_175_linkedins_cleaned.csv"
        df_cleaned.to_csv(output_file, index=False)
        print(f"Cleaned data saved to: {output_file}")
        
    else:
        print("No duplicate rows found! The dataset is already clean.")
    
    # Additional analysis: check for potential duplicates based on individual columns
    print(f"\nAdditional Analysis:")
    print(f"Unique LinkedIn URLs: {df['Linkedin'].nunique()} out of {len(df)}")
    print(f"Unique First Names: {df['Firts Name'].nunique()} out of {len(df)}")
    print(f"Unique Last Names: {df['Last Name'].nunique()} out of {len(df)}")
    
    # Check for duplicate LinkedIn URLs (most important for leads)
    linkedin_duplicates = df['Linkedin'].duplicated()
    linkedin_dup_count = linkedin_duplicates.sum()
    
    if linkedin_dup_count > 0:
        print(f"\nWarning: Found {linkedin_dup_count} duplicate LinkedIn URLs!")
        print("Rows with duplicate LinkedIn URLs:")
        linkedin_dups = df[df['Linkedin'].duplicated(keep=False)].sort_values('Linkedin')
        print(linkedin_dups[['Firts Name', 'Last Name', 'Linkedin']])

if __name__ == "__main__":
    check_and_remove_duplicates()