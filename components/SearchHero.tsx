
import React, { useState } from 'react';
import { Search, X, ArrowUpRight, BookOpen, Fingerprint, Activity, FileText, LucideIcon } from 'lucide-react';

interface PromptCategory {
  title: string;
  icon: LucideIcon;
  prompts: string[];
}

interface SearchHeroProps {
  onSearch: (query: string) => void;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);

  const categories: PromptCategory[] = [
    {
      title: 'Literature Review',
      icon: BookOpen,
      prompts: [
        'Summarize recent findings on CRISPR-Cas9 off-target effects in 2024',
        'Compare the efficacy of different sequencing technologies for rare diseases',
        'What is the current consensus on the genetic architecture of schizophrenia?'
      ]
    },
    {
      title: 'Gene Insight',
      icon: Fingerprint,
      prompts: [
        'Explain the role of the BRCA1 gene in breast cancer susceptibility',
        'What are the known regulatory elements for the ACE2 gene in humans?',
        'Analyze the impact of missense mutations in the TP53 DNA-binding domain'
      ]
    },
    {
      title: 'Disease Insight',
      icon: Activity,
      prompts: [
        'List common genomic variants associated with Type 2 Diabetes GWAS',
        'Analyze the genetic basis of rare neurodevelopmental disorders',
        'What is the role of mitochondrial DNA variants in cardiovascular health?'
      ]
    },
    {
      title: 'Use Cases',
      icon: FileText,
      prompts: [
        'Write a research proposal summary for a study on single-cell RNA sequencing',
        'Draft a patient-friendly explanation for a pathogenic variant in the LDLR gene',
        'Generate a summary of potential drug targets for Alzheimer’s disease based on GWAS'
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Genomic Literature Knowledge Base
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          Discover insights from genomic research with AI-powered search and analysis
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="w-full bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300 mb-8"
      >
        <div className="flex items-start gap-4">
          <Search className="text-gray-400 mt-2 shrink-0" size={24} />
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Search genomic datasets, literature, or analyze gene variants..."
            className="w-full resize-none border-none focus:ring-0 text-gray-800 text-lg py-1 min-h-[100px] bg-transparent"
          />
        </div>
        <div className="flex justify-end mt-2">
           <button 
             type="submit"
             disabled={!query.trim()}
             className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-sm"
           >
            Search
           </button>
        </div>
      </form>

      {/* Categories / Expanded Questions Section */}
      <div className="w-full transition-all duration-300">
        {!selectedCategory ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2">Example:</span>
            {categories.map((cat) => (
              <button
                key={cat.title}
                onClick={() => setSelectedCategory(cat)}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2"
              >
                <cat.icon size={16} className="text-gray-400" />
                {cat.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Expansion Header - reduced vertical padding */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                  <selectedCategory.icon size={18} />
                </div>
                <h3 className="font-bold text-gray-800">{selectedCategory.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Prompt List - adjusted padding to remove unnecessary gap */}
            <div className="px-5 pb-5 pt-3 space-y-3">
              {selectedCategory.prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSearch(prompt)}
                  className="w-full text-left p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-200 transition-all group flex items-center justify-between gap-4"
                >
                  <span className="text-gray-700 font-medium leading-relaxed">{prompt}</span>
                  <ArrowUpRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHero;
