from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ============================================
# CONFIGURAR GEMINI AI
# ============================================

API_KEY = os.getenv('GEMINI_API_KEY')

if not API_KEY or API_KEY == 'sua_chave_aqui':
    print("⚠️ AVISO: Configure GEMINI_API_KEY no arquivo .env")
    print("Obtenha em: https://makersuite.google.com/app/apikey")
else:
    genai.configure(api_key=API_KEY)
    print("✅ Gemini AI configurado")

model = genai.GenerativeModel('gemini-pro')

# Histórico de conversas
conversations = {}

# ============================================
# PROMPT DO SISTEMA
# ============================================

def get_system_prompt():
    return """Você é um assistente especializado em gerenciamento de tarefas e produtividade.

**Seu papel:**
- Ajudar usuários a organizar tarefas e projetos
- Responder perguntas sobre o app de gerenciamento
- Sugerir melhorias de produtividade
- Motivar e encorajar os usuários
- Explicar funcionalidades do app

**Funcionalidades do app que você deve conhecer:**
1. Criar quadros (boards) para projetos
2. Criar listas dentro dos quadros (ex: A Fazer, Fazendo, Feito)
3. Criar tarefas com título, descrição, prazo e responsável
4. Marcar tarefas como concluídas
5. Dashboard com estatísticas
6. Chat com IA (você!)

**Como responder perguntas:**
- "Como criar tarefa?" → Explique o processo passo a passo
- "Estou atrasado" → Dê dicas de priorização
- "O que é dashboard?" → Explique as estatísticas

**Tom de voz:**
- Amigável e profissional
- Conciso mas completo
- Use emojis quando apropriado
- Sempre em português

**IMPORTANTE:**
- SEMPRE responda em português brasileiro
- Seja objetivo mas empático
- Se não souber algo específico, admita e sugira alternativas
"""

# ============================================
# FUNÇÕES DO CHATBOT
# ============================================

def get_bot_response(user_message, user_id):
    """Gera resposta usando Gemini AI"""
    
    if user_id not in conversations:
        conversations[user_id] = []
    
    conversations[user_id].append({
        'role': 'user',
        'parts': [user_message]
    })
    
    if len(conversations[user_id]) > 10:
        conversations[user_id] = conversations[user_id][-10:]
    
    try:
        full_prompt = f"""{get_system_prompt()}

Histórico da conversa:
{format_history(conversations[user_id])}

Mensagem atual do usuário: {user_message}

Responda de forma útil e amigável:"""
        
        response = model.generate_content(full_prompt)
        bot_reply = response.text
        
        conversations[user_id].append({
            'role': 'model',
            'parts': [bot_reply]
        })
        
        return bot_reply
        
    except Exception as e:
        print(f"Erro na IA: {e}")
        return get_fallback_response(user_message)

def format_history(history):
    """Formata histórico para o prompt"""
    formatted = []
    for msg in history[-6:]:
        role = "Usuário" if msg['role'] == 'user' else "Bot"
        content = msg['parts'][0]
        formatted.append(f"{role}: {content}")
    return "\n".join(formatted)

def get_fallback_response(message):
    """Respostas padrão se a IA falhar"""
    
    msg_lower = message.lower()
    
    if any(word in msg_lower for word in ['oi', 'olá', 'ola', 'hey', 'alo']):
        return "Olá! 👋 Sou seu assistente de gerenciamento de tarefas. Como posso ajudar você hoje?"
    
    if 'criar' in msg_lower and 'tarefa' in msg_lower:
        return """Para criar uma tarefa, siga estes passos:

1️⃣ Abra um quadro
2️⃣ Clique no botão "+" dentro de uma lista
3️⃣ Preencha:
   • Título da tarefa
   • Descrição (opcional)
   • Prazo (AAAA-MM-DD)
   • Responsável
4️⃣ Clique em "Criar"

Pronto! Sua tarefa foi criada! ✅"""
    
    if 'dashboard' in msg_lower:
        return """O Dashboard mostra estatísticas do seu projeto:

📊 **Estatísticas:**
• Total de tarefas
• Tarefas concluídas
• Tarefas atrasadas
• Tarefas vencendo hoje
• Tarefas próximas

Acesse clicando no ícone 📊 na barra inferior!"""
    
    if 'atrasad' in msg_lower or 'prazo' in msg_lower:
        return """Tarefas atrasadas? Aqui estão dicas rápidas:

⚡ **Priorize:**
1. Identifique as mais urgentes
2. Quebre tarefas grandes em menores
3. Foque em uma de cada vez

💡 **Dica:** Use o Dashboard para ver todas as tarefas atrasadas em um só lugar!

Você consegue! 💪"""
    
    if 'help' in msg_lower or 'ajuda' in msg_lower:
        return """Posso ajudar você com:

📋 **Tarefas:**
• Como criar, editar e organizar tarefas
• Dicas de priorização

📊 **Dashboard:**
• Entender estatísticas
• Visualizar progresso

💬 **Chat:**
• Tirar dúvidas
• Obter dicas de produtividade

O que você precisa saber?"""
    
    return f"""Entendi sua mensagem: "{message}"

Posso ajudar você com:
• Criar e organizar tarefas
• Entender o dashboard
• Dicas de produtividade

O que você gostaria de saber? 😊"""

# ============================================
# ROTAS
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/', methods=['GET'])
def home():
    """Página inicial (raiz)"""
    return "Bem-vindo ao Task Manager ChatBot! 🚀"

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint principal do chat"""
    try:
        data = request.json
        user_id = data.get('userId', 'default')
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Mensagem vazia'
            }), 400
        
        reply = get_bot_response(message, user_id)
        
        return jsonify({
            'success': True,
            'reply': reply,
            'timestamp': datetime.now().isoformat(),
            'userId': user_id
        })
        
    except Exception as e:
        print(f'Erro no chat: {e}')
        return jsonify({
            'success': False,
            'error': str(e),
            'reply': 'Desculpe, ocorreu um erro. Tente novamente.'
        }), 500

# ============================================
# INICIAR
# ============================================

if __name__ == '__main__':
    print('━' * 50)
    print('🤖 Task Manager ChatBot')
    print('━' * 50)
    print('📍 Servidor: http://localhost:5001')
    print('💬 Endpoint: POST /chat')
    print('💚 Health: GET /health')
    print('━' * 50)
    
    app.run(debug=True, port=5001, host='0.0.0.0')