"""Seed script to populate 5 gift templates for GiftForge MVP."""
import asyncio
from app.database import AsyncSessionLocal
from app.models.gift import GiftTemplate


async def seed_gift_templates():
    """Seed 5 gift templates."""
    
    templates = [
        {
            "name": "Birthday Blast",
            "description": "A joyful and colorful birthday celebration card",
            "category": "birthday",
            "preview_image": "/assets/templates/birthday-blast.svg",
            "display_order": 1,
            "questionnaire_fields": {
                "fields": [
                    {
                        "id": "recipient_name",
                        "label": "Recipient's Name",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., Sarah"
                    },
                    {
                        "id": "age",
                        "label": "Age (optional)",
                        "type": "number",
                        "required": False,
                        "placeholder": "e.g., 25"
                    },
                    {
                        "id": "favorite_color",
                        "label": "Favorite Color",
                        "type": "select",
                        "required": False,
                        "options": ["Red", "Blue", "Green", "Yellow", "Purple", "Pink"]
                    },
                    {
                        "id": "custom_message",
                        "label": "Your Message",
                        "type": "textarea",
                        "required": True,
                        "placeholder": "Write a heartfelt birthday message..."
                    }
                ]
            },
            "template_structure": {
                "theme": "birthday",
                "colors": ["#FF6B9D", "#C44569", "#FFA502"],
                "elements": ["balloons", "cake", "confetti"]
            }
        },
        {
            "name": "Thank You Note",
            "description": "Express gratitude with warmth and sincerity",
            "category": "thank_you",
            "preview_image": "/assets/templates/thank-you.svg",
            "display_order": 2,
            "questionnaire_fields": {
                "fields": [
                    {
                        "id": "recipient_name",
                        "label": "Recipient's Name",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., Mr. Johnson"
                    },
                    {
                        "id": "reason",
                        "label": "What are you thanking them for?",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., your generous gift"
                    },
                    {
                        "id": "custom_message",
                        "label": "Your Message",
                        "type": "textarea",
                        "required": True,
                        "placeholder": "Express your gratitude..."
                    }
                ]
            },
            "template_structure": {
                "theme": "gratitude",
                "colors": ["#4ECDC4", "#44A08D", "#95E1D3"],
                "elements": ["heart", "flowers"]
            }
        },
        {
            "name": "Anniversary Love",
            "description": "Celebrate your special milestone together",
            "category": "anniversary",
            "preview_image": "/assets/templates/anniversary.svg",
            "display_order": 3,
            "questionnaire_fields": {
                "fields": [
                    {
                        "id": "recipient_name",
                        "label": "Your Partner's Name",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., Alex"
                    },
                    {
                        "id": "years",
                        "label": "Years Together",
                        "type": "number",
                        "required": False,
                        "placeholder": "e.g., 5"
                    },
                    {
                        "id": "special_memory",
                        "label": "A Special Memory",
                        "type": "text",
                        "required": False,
                        "placeholder": "e.g., our first trip to Paris"
                    },
                    {
                        "id": "custom_message",
                        "label": "Your Message",
                        "type": "textarea",
                        "required": True,
                        "placeholder": "Share your love..."
                    }
                ]
            },
            "template_structure": {
                "theme": "romance",
                "colors": ["#D63031", "#E84393", "#FD79A8"],
                "elements": ["hearts", "roses", "rings"]
            }
        },
        {
            "name": "Congratulations",
            "description": "Celebrate their achievement with style",
            "category": "congratulations",
            "preview_image": "/assets/templates/congrats.svg",
            "display_order": 4,
            "questionnaire_fields": {
                "fields": [
                    {
                        "id": "recipient_name",
                        "label": "Recipient's Name",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., Maria"
                    },
                    {
                        "id": "achievement",
                        "label": "What are you congratulating them for?",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., graduation, new job, promotion"
                    },
                    {
                        "id": "custom_message",
                        "label": "Your Message",
                        "type": "textarea",
                        "required": True,
                        "placeholder": "Celebrate their success..."
                    }
                ]
            },
            "template_structure": {
                "theme": "celebration",
                "colors": ["#F39C12", "#E67E22", "#F8C471"],
                "elements": ["trophy", "stars", "ribbon"]
            }
        },
        {
            "name": "Get Well Soon",
            "description": "Send healing wishes and positive vibes",
            "category": "get_well",
            "preview_image": "/assets/templates/get-well.svg",
            "display_order": 5,
            "questionnaire_fields": {
                "fields": [
                    {
                        "id": "recipient_name",
                        "label": "Recipient's Name",
                        "type": "text",
                        "required": True,
                        "placeholder": "e.g., David"
                    },
                    {
                        "id": "relation",
                        "label": "Your Relationship",
                        "type": "select",
                        "required": False,
                        "options": ["Friend", "Family", "Colleague", "Neighbor"]
                    },
                    {
                        "id": "custom_message",
                        "label": "Your Message",
                        "type": "textarea",
                        "required": True,
                        "placeholder": "Send your healing wishes..."
                    }
                ]
            },
            "template_structure": {
                "theme": "wellness",
                "colors": ["#74B9FF", "#81ECEC", "#A29BFE"],
                "elements": ["sun", "flowers", "tea"]
            }
        }
    ]
    
    async with AsyncSessionLocal() as session:
        # Check if templates already exist
        from sqlalchemy import select, func
        result = await session.execute(select(func.count(GiftTemplate.id)))
        count = result.scalar()
        
        if count >= 5:
            print(f"✅ Gift templates already seeded ({count} templates exist)")
            return
        
        print("🎁 Seeding 5 gift templates...")
        for template_data in templates:
            template = GiftTemplate(**template_data)
            session.add(template)
        
        await session.commit()
        print("✅ Successfully seeded 5 gift templates!")


if __name__ == "__main__":
    asyncio.run(seed_gift_templates())
