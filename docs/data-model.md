# NafaSchool Data Model

## Core Entities & Attributes

### **Guardian**
- `id` (Primary Key)
- `name`
- `phone`

### **Pupil**
- `id` (Primary Key)
- `name`
- `class`
- `guardian_id` (Foreign Key -> `Guardian.id`)

### **FeeSchedule**
- `id` (Primary Key)
- `term`
- `amount` *(your D-based fee)*
- `installments_allowed` *(your D rule)*

### **Payment**
- `id` (Primary Key)
- `pupil_id` (Foreign Key -> `Pupil.id`)
- `amount`
- `method`
- `request_id`
- `recorded_at`

---

## Relationships
- **Guardian *enrolls* Pupil (1-to-Many):** One guardian can have multiple pupils; each pupil has one guardian (`Pupil.guardian_id -> Guardian.id`).
- **Pupil *makes* Payment (1-to-Many):** One pupil can make multiple payments; each payment belongs to one pupil (`Payment.pupil_id -> Pupil.id`).
- **FeeSchedule *governs* Term:** Defines the single fee amount and maximum installment count for the active term.

---

## Data Integrity Rules ("Store Each Fact Once")
- Guardian `name` and `phone` live only in `Guardian` (referenced via `guardian_id`).
- Fee `amount` and installment limit live only in `FeeSchedule`.
- Balance and installments used are never stored as columns; they are dynamically computed on the server from `FeeSchedule` and `Payment`.