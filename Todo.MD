[ ] console.error: implement error handling

## Database

[ ] test - Implement test for creating a user, company, contractor, document, add document to contractor, add contractor to company, ensure user can see contractor documents
[ ] test - create the same structure again, ensure users can't see each other's data
[x] Use a wrapper class to map JS names to DB names
[ ] updated_at now() - update on insert
[ ] test - ensure that the user can't see the contractor's documents  
[x] can timestamps be stored as ints? Otherwise we might want to convert them to and front int on js side
[x] for insert records, change types to optional instead of omitting, this way we still have full typing for them. Partial?
[ ] helper functions: .throw() - checks for errors and throws them
[ ] helper functions: .first() - returns the first element of an array or throws
[ ] sql implementation load - Could support array of field parameters
[ ] Make sure RLS is configured properly for each table
