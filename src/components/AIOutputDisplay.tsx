import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AIRecommendation } from '@/types';
import { 
  Download, 
  ArrowLeft, 
  Lightbulb, 
  Type, 
  MessageSquare, 
  Share2, 
  Image,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AIOutputDisplayProps {
  recommendation: AIRecommendation;
  isDarkMode: boolean;
  onBack: () => void;
}

export function AIOutputDisplay({ recommendation, isDarkMode, onBack }: AIOutputDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`campaign-brief-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Create New Brief
        </Button>
        <Button onClick={handleExportPDF}>
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Content for PDF export */}
      <div ref={contentRef} className="space-y-6">
        {/* Header */}
        <div className={`
          rounded-lg p-6 text-center
          ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'}
        `}>
          <Badge className="mb-3 bg-white/20 text-white border-0">
            AI-Generated Campaign Brief
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-2">
            {recommendation.campaignTitle}
          </h2>
          <p className="text-white/80">
            Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Headlines */}
        <Card className={isDarkMode ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
              <Type className="w-5 h-5 text-blue-500" />
              Recommended Headlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendation.headlines.map((headline, index) => (
              <div 
                key={index}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}
                `}
              >
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                  ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}
                `}>
                  {index + 1}
                </span>
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {headline}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tone of Voice */}
        <Card className={isDarkMode ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
              <MessageSquare className="w-5 h-5 text-green-500" />
              Tone of Voice Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
              {recommendation.toneOfVoice}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Consistent', 'Authentic', 'Engaging', 'Clear'].map((trait) => (
                <Badge 
                  key={trait}
                  variant="secondary"
                  className={isDarkMode ? 'bg-slate-700 text-slate-300' : ''}
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Recommendations */}
        <Card className={isDarkMode ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
              <Share2 className="w-5 h-5 text-purple-500" />
              Recommended Channels & Budget Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendation.channels.map((channel, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>
                      {channel.name}
                    </span>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>
                      {channel.budgetAllocation}%
                    </span>
                  </div>
                  <div className={`
                    h-2 rounded-full overflow-hidden
                    ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}
                  `}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${channel.budgetAllocation}%` }}
                    />
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {channel.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visual Direction */}
        <Card className={isDarkMode ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
              <Image className="w-5 h-5 text-orange-500" />
              Key Visual Direction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
              {recommendation.visualDirection}
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['High Quality', 'Brand Aligned', 'Consistent', 'Engaging'].map((item) => (
                <div 
                  key={item}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg
                    ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}
                  `}
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className={isDarkMode ? 'bg-slate-800 border-slate-700' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Test multiple headline variations to optimize performance
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Maintain consistent visual identity across all channels
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Monitor and adjust budget allocation based on early performance
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                A/B test creative elements to maximize engagement
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
