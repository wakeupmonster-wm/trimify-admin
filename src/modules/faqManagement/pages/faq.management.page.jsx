import { Container } from '@/components/common/container';
import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/shared/datatable';
import { getFaqManagementColumns } from '@/components/columns/faq.management.columns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, HelpCircle } from 'lucide-react';
import Header from '@/components/common/header';
import { PageHeader } from '@/components/common/headSubhead';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFaqList, addFaq } from '../store/faq.slice';
import { useEffect } from 'react';

const dummyFaqs = [
  {
    id: 1,
    question: "How is my data protected?",
    answer: "Trimify prioritises your privacy and complies with...",
    status: true,
  },
  {
    id: 2,
    question: "Can I integrate Trimify w...",
    answer: "Yes, Trimify syncs with popular wearable devices a...",
    status: true,
  },
  {
    id: 3,
    question: "Do I need an internet con...",
    answer: "An internet connection is required to access most ...",
    status: true,
  },
  {
    id: 4,
    question: "Is Trimify available on i...",
    answer: "Yes, Trimify is available for download on both the...",
    status: true,
  },
  {
    id: 5,
    question: "Are there fitness program...",
    answer: "Yes, Trimify offers fitness programs for all level...",
    status: true,
  },
  {
    id: 6,
    question: "Does Trimify offer meal p...",
    answer: "Absolutely! Trimify provides meal planning tools, ...",
    status: true,
  },
  {
    id: 7,
    question: "Can I track my progress i...",
    answer: "Yes, Trimify includes a progress tracking feature ...",
    status: true,
  },
  {
    id: 8,
    question: "Who is Trimify for?",
    answer: "Trimify is for anyone looking to improve their hea...",
    status: true,
  },
  {
    id: 9,
    question: "Is the app free to use?",
    answer: "Yes! Trimify app is free to use.",
    status: true,
  },
  {
    id: 10,
    question: "What is this fitness app ...",
    answer: "Trimify app helps you track workouts, monitor prog...",
    status: true,
  }
];

const FaqManagementPage = () => {
    const dispatch = useDispatch();
    const { faqs, loading, pagination: serverPagination } = useSelector((state) => state.faqManagement);

    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [formData, setFormData] = useState({ question: "", answer: "" });
    
    useEffect(() => {
      dispatch(
        fetchFaqList({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
        })
      );
    }, [dispatch, pagination.pageIndex, pagination.pageSize, globalFilter]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await dispatch(addFaq(formData));
      setFormData({ question: "", answer: "" }); // Reset form
    };

    const handleAction = (row, action, value) => {
      if (action === "toggle-status") {
        console.log("Toggle status for:", row.id, value);
      } else if (action === "edit") {
        console.log("Edit FAQ:", row);
      } else if (action === "delete") {
        console.log("Delete FAQ:", row);
      }
    };

    const columns = useMemo(() => getFaqManagementColumns(handleAction), []);

    return (
      <Container>
        <div className='space-y-8 mt-4'>
          {/* Top Header matching standard design */}
          <Header>
            <div className="flex-1 min-w-0">
              <PageHeader
                heading="FAQ"
                icon={<HelpCircle className="w-9 h-9 text-white" />}
                color="bg-brand-blue shadow-md"
                subheading="Manage Frequently Asked Questions for the platform."
              />
            </div>
          </Header>

          {/* Add FAQ Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-brand-blue py-3 px-6 text-center">
              <h2 className="text-white text-base font-semibold">Add FAQ</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-800">Question</Label>
                <Input
                  name="question"
                  placeholder="Enter Question"
                  value={formData.question}
                  onChange={handleChange}
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-800">Answer</Label>
                <Textarea
                  name="answer"
                  placeholder="Enter Answer"
                  value={formData.answer}
                  onChange={handleChange}
                  className="min-h-[80px] text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 border-slate-200 resize-none"
                  required
                />
              </div>
              <div className="pt-2 flex justify-center">
                <Button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-6 py-2 h-auto text-sm font-medium flex items-center gap-2"
                >
                  Add Faq's <Send className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </form>
          </div>

          {/* DataTable */}
          <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4">
            <DataTable
              columns={columns}
              data={faqs || []}
              rowCount={serverPagination ? serverPagination.total : (faqs?.length || 0)}
              pagination={pagination}
              onPaginationChange={setPagination}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              searchPlaceholder="Search faqs..."
              itemName="entries"
              isLoading={loading}
              manualPagination={!!serverPagination}
              manualFiltering={!!serverPagination}
            />
          </div>
        </div>
      </Container>
    );
};

export default FaqManagementPage;