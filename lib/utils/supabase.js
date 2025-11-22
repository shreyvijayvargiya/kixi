import { createClient } from "@supabase/supabase-js";

const key =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidmlld21zcWd0ZXB3a2JwYWtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2ODc3MDYyMCwiZXhwIjoxOTg0MzQ2NjIwfQ.quS6qtS81uaJ2QRgoZ4PyDXIQQvmbk0nHyaZs-xOOEM";
const url = " https://bbviewmsqgtepwkbpakl.supabase.co";

if (!key || !url) {
	throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(url, key);

export default supabase;
