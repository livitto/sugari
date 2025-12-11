-- Add unit column to glucose_readings table to support mg/dL and mmol/L
ALTER TABLE glucose_readings 
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'mg/dL' CHECK (unit IN ('mg/dL', 'mmol/L'));

-- Update existing readings to use mg/dL as default
UPDATE glucose_readings 
SET unit = 'mg/dL' 
WHERE unit IS NULL;
