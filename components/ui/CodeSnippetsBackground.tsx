export default function CodeSnippetsBackground() {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-15 z-0">
            {/* FastAPI - Top Right */}
            <div className="absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[6%] right-[6%] max-w-[360px] leading-[1.6]">
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--input)]">
                    {`from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI(title="orders")

class Order(BaseModel):
    id: int
    total: float

@app.get("/health")
async def health_check():
    return {"status": "ok"}`}
                </div>
            </div>

            {/* Celery - Bottom Right */}
            <div className="absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-0 right-[18%] max-w-[320px] leading-[1.6]">
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--input)]">
                    {`# celery_app.py
from celery import Celery
celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

@celery_app.task
def send_email(user_id: int) -> None:
    ...`}
                </div>
            </div>

            {/* PostgreSQL CLI - Bottom Center Left */}
            <div className="absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-[2%] left-[28%] max-w-[280px] leading-[1.6]">
                <div className="p-3 rounded border-dashed border border-[var(--border)] bg-[var(--background)]">
                    {`$ psql postgresql://localhost/app
> \\dt
> SELECT COUNT(*) FROM orders;
> EXPLAIN ANALYZE SELECT * FROM orders
  WHERE status = 'open';`}
                </div>
            </div>

            {/* Uvicorn Logs - Top Center Left */}
            <div className="absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[25%] left-[45%] max-w-[260px] leading-[1.6]">
                <div className="p-3 rounded border border-[var(--border)] bg-[var(--background)]">
                    {`$ uvicorn app:app --reload
INFO Loaded config from .env
INFO Started server process [8421]
INFO Waiting for application startup.
INFO Application startup complete.`}
                </div>
            </div>

            {/* Git Clone - Top Left */}
            <div className="absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] top-[14%] left-[6%] max-w-[320px] leading-[1.6]">
                <div className="p-3 rounded border-dashed border border-[var(--border)] bg-[var(--background)]">
                    {`$ git clone git@github.com:veenzent/orders-service.git
$ cd orders-service
$ uvicorn app.main:app --reload`}
                </div>
            </div>

            {/* SQLAlchemy - Bottom Left */}
            <div className="absolute text-xs font-mono whitespace-pre text-[var(--muted-foreground)] bottom-[20%] left-[2%] max-w-[340px] leading-[1.6]">
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--input)]">
                    {`# db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+psycopg2://app:***@localhost:5432/orders"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)`}
                </div>
            </div>
        </div>
    );
}
