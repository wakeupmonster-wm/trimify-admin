# Failed API Endpoints

### 1. Add Fitzone Intro

- **Endpoint**: `https://testadmin.trimify.com.au/api/admin/fitzone-intro`
- **HTTP Method**: POST
- **Status Code**: 500 Internal Server Error

**Payload**:

```json
{
  "fitzone_id": "57",
  "heading": "testing ",
  "sub_heading": "tesing ",
  "content": "<p><strong><span data-preserver-spaces=\"true\">Welcome to Your 6-week Maintenance Journey!</span></strong></p>\n<p><span data-preserver-spaces=\"true\">Over the next six weeks, you&rsquo;ll embark on a transformative experience designed to help you achieve your goals, build sustainable habits, and create lasting change. Whether you&rsquo;re focusing on fitness, nutrition, mental well-being, or overall lifestyle improvement, this program </span><span data-preserver-spaces=\"true\">is tailored</span><span data-preserver-spaces=\"true\"> to guide and support you every step </span><span data-preserver-spaces=\"true\">of the way</span><span data-preserver-spaces=\"true\">.</span></p>\n<p><span data-preserver-spaces=\"true\">Each week, you&rsquo;ll tackle new challenges, learn valuable tools, and </span><span data-preserver-spaces=\"true\">make steady</span><span data-preserver-spaces=\"true\"> progress toward your objectives. From establishing a strong foundation to refining your routines and overcoming obstacles, this program </span><span data-preserver-spaces=\"true\">is structured</span><span data-preserver-spaces=\"true\"> to keep you motivated, accountable, and on track.</span></p>"
}
```

### 2. Get Users (with status filter)

- **Endpoint**: `https://testadmin.trimify.com.au/api/admin/users?page=1&limit=10&search=&status=new_today`
- **HTTP Method**: GET
- **Issue**: Fails when passing specific filter params. The following `status` values currently return errors:
  - `status=new_today`
  - `status=zero_engagement`
  - `status=ghosted`
  - `status=Inactive`
  - `status=Active`

**Example Failed Endpoints**:

- `https://testadmin.trimify.com.au/api/admin/users?page=1&limit=10&search=&status=new_today`
- `https://testadmin.trimify.com.au/api/admin/users?page=1&limit=10&search=&status=zero_engagement`
- `https://testadmin.trimify.com.au/api/admin/users?page=1&limit=10&search=&status=ghosted`
- `https://testadmin.trimify.com.au/api/admin/users?page=1&limit=10&search=&status=Inactive`
- `https://testadmin.trimify.com.au/api/admin/users?page=1&limit=10&search=&status=Active`

**Note**: More filter combinations will be added here as they are tested.

### 3. View Blogs (Inconsistent Data Values)

- **Endpoint**: `https://testadmin.trimify.com.au/api/admin/view-blog?page=1&limit=10&search=`
- **HTTP Method**: GET
- **Issue**: There is a data inconsistency in the `visibility_status` field. Some records return `"visibility_status": "Publish"`, while others return `"visibility_status": "Public"`. This needs to be standardized to a single valid enum value (e.g., `"Published"` or `"Public"`).
