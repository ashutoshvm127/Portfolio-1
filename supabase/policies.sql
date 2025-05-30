-- Enable RLS on the table
alter table "public"."contact_submissions" enable row level security;

-- Create policy to allow anonymous insertions
create policy "Allow anonymous contact submissions"
on "public"."contact_submissions"
for insert
to anon
with check (true);
