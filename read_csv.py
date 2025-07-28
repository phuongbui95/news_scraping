import pandas as pd

output_path = "forex_factory_thisweek.csv"

# Read the CSV file
df = pd.read_csv(output_path)

# Filter for high impact events
criteria = df[(df['Impact'] != "Low") & (~df['Country'].isin(['AUD','NZD','CNY','CHF','CAD']))]
filtered_events = criteria.drop(columns=['URL'], errors='ignore')

# Display filtered results
print("\nHigh Impact Events This Week:")
print("-" * 80)
print(filtered_events.to_string(index=False))

# Optional: Display count of high impact events
print(f"\nTotal high impact events: {len(filtered_events)}")
