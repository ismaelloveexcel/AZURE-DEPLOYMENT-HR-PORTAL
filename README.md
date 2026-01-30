# 🎁 GiftForge - AI-Powered Gift Creation Platform

**Create beautiful, personalized gifts in minutes with AI**

GiftForge is a delightful gift creation platform that combines beautiful templates, interactive questionnaires, and AI-powered content generation to help you create the perfect personalized gift for any occasion.

## ✨ Features

- **5 Beautiful Templates**: Choose from Birthday, Thank You, Anniversary, Congratulations, and Get Well Soon
- **Interactive Questionnaire**: Answer a few simple questions to personalize your gift
- **Live Preview**: See your gift come to life before finalizing
- **AI Generation**: Powered by AI to create heartfelt, unique messages
- **Safety First**: Built-in content moderation to ensure all gifts are appropriate
- **Shareable Links**: Get a unique, shareable link for each gift
- **Instant Delivery**: Share your gift via a beautiful web page

## 🚀 Quick Start

### Local Development

```bash
# Backend (FastAPI + Python)
cd backend
pip install uv
uv sync
uv run alembic upgrade head
uv run python ../scripts/seed_gift_templates.py
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (React + Vite)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173/giftforge` to start creating gifts!

## 🎨 How It Works

1. **Choose a Template**: Pick from 5 stunning, occasion-specific templates
2. **Fill the Questionnaire**: Answer personalized questions about your gift
3. **Preview**: Review your gift details before generation
4. **Generate**: AI creates a beautiful, personalized message
5. **Pay & Share**: Complete payment and get your unique shareable link

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Python 3.11, FastAPI, SQLAlchemy (async)
- **Database**: PostgreSQL
- **Deployment**: Azure App Service

## 📝 API Endpoints

- `GET /api/gifts/templates` - List all gift templates
- `POST /api/gifts/questionnaire` - Submit questionnaire and create gift
- `POST /api/gifts/generate` - Generate AI content for a gift
- `GET /api/gifts/view/{code}` - View a gift by its unique code
- `POST /api/gifts/payment` - Process payment (stub)

## 🎯 MVP Features

- ✅ 5 locked templates
- ✅ Questionnaire flow with validation
- ✅ Live preview
- ✅ AI content generation (stubbed)
- ✅ Safety content filtering
- ✅ Unique link generation
- ✅ Stub payment flow
- ✅ Beautiful animations and UX
- ✅ Mobile responsive

## 🔒 Safety & Moderation

GiftForge includes built-in content moderation to ensure all generated content is appropriate and family-friendly. Gifts that violate our safety guidelines are automatically flagged and rejected.

## 💝 Example Use Cases

- Send a birthday wish to a friend
- Thank someone for their kindness
- Celebrate an anniversary with your partner
- Congratulate someone on their achievement
- Send healing wishes to someone recovering

## 🌐 Deployment

The app is configured for Azure App Service deployment with automatic CI/CD via GitHub Actions.

```bash
# Deploy to Azure
./deploy_to_azure.sh
```

## 📄 License

MIT

## 🎉 Credits

Built with ❤️ using FastAPI, React, and the power of AI.

---

**Note**: This repository also contains an HR Portal system. For HR Portal documentation, see [START_HERE.md](START_HERE.md).

