import pandas as pd
from sklearn.model_selection import train_test_split

# === PARAMETERS ===
input_csv = r"C:\Users\domin\Downloads\SMS PHISHING DATASET FOR MACHINE LEARNING AND PATTERN RECOGNITION\SMS PHISHING DATASET FOR MACHINE LEARNING AND PATTERN RECOGNITION\Dataset_5971\Dataset_5971.csv"    # Path to your input CSV
output_csv = "sampled_messages.csv"  # Output file
sample_fraction = 0.3                # Or set to None if using sample_count
sample_count = 33                # Set e.g. 100 for fixed number per class

# === LOAD DATA ===
df = pd.read_csv(input_csv)

# Check for required columns
required_cols = {"LABEL", "TEXT", "URL", "EMAIL", "PHONE"}
if not required_cols.issubset(df.columns):
    raise ValueError(f"Missing one or more required columns: {required_cols - set(df.columns)}")

# === STRATIFIED SAMPLING ===
if sample_count:
    sampled_df = (
        df.groupby("LABEL", group_keys=False)
        .apply(lambda x: x.sample(n=min(sample_count, len(x)), random_state=42))
    )
elif sample_fraction:
    sampled_df = (
        df.groupby("LABEL", group_keys=False)
        .apply(lambda x: x.sample(frac=sample_fraction, random_state=42))
    )
else:
    raise ValueError("You must specify either sample_fraction or sample_count.")

# === SAVE TO CSV ===
sampled_df.to_csv(output_csv, index=False)
print(f"✓ Sampled data saved to '{output_csv}'")
