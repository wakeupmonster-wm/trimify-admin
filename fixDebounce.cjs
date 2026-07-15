const fs = require('fs');
const path = require('path');

const files = [
  'src/modules/cmsManagement/pages/cms.management.page.jsx',
  'src/modules/dataManagement/pages/nutrition.food.page.jsx',
  'src/modules/faqManagement/pages/faq.management.page.jsx',
  'src/modules/fitzoneManagement/pages/fitzone.management.page.jsx',
  'src/modules/manageProgram/pages/manage.program.page.jsx',
  'src/modules/notificationManage/pages/notification.manage.page.jsx',
  'src/modules/profileReview/pages/reports.profiles.page.jsx',
  'src/modules/subAdmin/pages/subadmin.page.jsx',
  'src/modules/subscriptionManagement/pages/subscription.management.page.jsx',
  'src/modules/transactionManagement/pages/transaction.management.page.jsx',
  'src/modules/userManagement/pages/users.management.page.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the broken useState signature
  content = content.replace(/const \[debouncedSearchTerm,\s*setGlobalFilter\]\s*=\s*useState/g, 'const [globalFilter, setGlobalFilter] = useState');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});
