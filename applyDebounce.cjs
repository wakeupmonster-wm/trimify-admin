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
  
  // Skip if already has useDebounce
  if (content.includes('useDebounce')) {
    console.log(`Skipping ${file} (already has useDebounce)`);
    return;
  }
  
  // Add import statement after the last import
  const importLines = content.split('\n').filter(line => line.startsWith('import '));
  if (importLines.length > 0) {
    const lastImport = importLines[importLines.length - 1];
    content = content.replace(lastImport, `${lastImport}\nimport { useDebounce } from "../../../hooks/useDebounce";`);
  } else {
    content = `import { useDebounce } from "../../../hooks/useDebounce";\n` + content;
  }
  
  // Add debouncedSearchTerm hook after globalFilter
  const globalFilterRegex = /const \[globalFilter,\s*setGlobalFilter\]\s*=\s*useState\(["']{2}\);/;
  if (globalFilterRegex.test(content)) {
    content = content.replace(globalFilterRegex, `$&
  const debouncedSearchTerm = useDebounce(globalFilter, 500);`);
  } else {
    // try to match without quotes
    const regex2 = /const \[globalFilter,\s*setGlobalFilter\]\s*=\s*useState\([^)]*\);/;
    content = content.replace(regex2, `$&
  const debouncedSearchTerm = useDebounce(globalFilter, 500);`);
  }
  
  // Replace search: globalFilter with search: debouncedSearchTerm
  // This is tricky because it might be `globalFilter` in a dependency array or as an object value
  // Let's replace `search: globalFilter` with `search: debouncedSearchTerm`
  content = content.replace(/search:\s*globalFilter/g, 'search: debouncedSearchTerm');
  
  // Also replace globalFilter with debouncedSearchTerm in useEffect dependency array
  // We can look for `globalFilter]` or `globalFilter,` in useEffect arrays.
  const useEffectDepsRegex = /\[([^\]]*?)globalFilter([^\]]*?)\]/g;
  content = content.replace(useEffectDepsRegex, (match, p1, p2) => {
    // Only replace if it's likely a dependency array, meaning it's near useEffect
    return `[${p1}debouncedSearchTerm${p2}]`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
