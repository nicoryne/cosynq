'use client';

import { 
  LexicalComposer 
} from '@lexical/react/LexicalComposer';
import { 
  RichTextPlugin 
} from '@lexical/react/LexicalRichTextPlugin';
import { 
  ContentEditable 
} from '@lexical/react/LexicalContentEditable';
import { 
  HistoryPlugin 
} from '@lexical/react/LexicalHistoryPlugin';
import { 
  LexicalErrorBoundary 
} from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { cn } from '@/lib/utils';

interface LexicalEditorProps {
  initialConfig?: any;
  onChange?: (editorState: any) => void;
  className?: string;
  placeholder?: string;
}

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph mb-2 last:mb-0',
  text: {
    bold: 'font-black',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-white/5 px-1.5 py-0.5 rounded font-mono text-primary text-xs',
  },
};

export function LexicalEditor({ 
  initialConfig, 
  onChange, 
  className,
  placeholder = 'Initiate log manifestation...' 
}: LexicalEditorProps) {
  
  const config = {
    namespace: 'CosplanJournal',
    theme,
    onError: (error: Error) => {
      console.error('Lexical Error:', error);
    },
    ...initialConfig,
  };

  return (
    <div className={cn("relative rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden group", className)}>
      <LexicalComposer initialConfig={config}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[300px] outline-none px-6 py-6 text-foreground font-medium selection:bg-primary/30" 
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 pointer-events-none text-muted-foreground/40 font-bold uppercase tracking-widest text-xs">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {onChange && (
            <OnChangePlugin onChange={onChange} />
          )}
        </div>
      </LexicalComposer>
    </div>
  );
}
