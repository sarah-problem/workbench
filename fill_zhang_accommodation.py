from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, NameObject, NumberObject


SOURCE = Path("/Users/sarahspencer/Library/CloudStorage/GoogleDrive-sarah@sarahproblem.com/My Drive/Client files/Zhang/Academic-Accommodation-Request-Form.pdf")
OUTPUT = Path("output/pdf/Zhang_Academic_Accommodation_Request_DRAFT.pdf")


VALUES = {
    "Student Name": "Chloe Zhang",
    "Date of Birth": "02/23/2008",
    "Specific diagnosis Include DSM5 or ICD 10 diagnostic code": (
        "Attention-Deficit/Hyperactivity Disorder, predominantly inattentive presentation "
        "(DSM-5-TR / ICD-10-CM F90.0)."
    ),
    "Date of diagnosis": "Exact date not available in provided records - confirm before signing",
    "Date of most recent evaluation": "05/05/2023 (Conners CPT 3); confirm if a later clinical evaluation occurred",
    "Procedures used to diagnose this condition": (
        "Clinical interview and treatment-provider assessment; review of developmental, "
        "educational, and treatment history; review of prior school accommodations; and "
        "review of the Conners Continuous Performance Test, Third Edition (CPT 3), "
        "administered 05/05/2023. The CPT 3 showed three atypical T-scores and a moderate "
        "likelihood of a disorder characterized by attention deficits, with findings indicating "
        "possible inattention and impulsivity."
    ),
    "Current impact of condition or the impact of the condition when active": (
        "ADHD causes involuntary and sometimes prolonged lapses in sustained attention. Chloe "
        "may disengage or 'zone out' for approximately 20 minutes at a time and cannot reliably "
        "prevent or immediately end these episodes through effort alone. During an episode she "
        "misses information and loses productive time; afterward she must identify what was "
        "missed, reorient to the task, and reconstruct her train of thought. Symptoms also impair "
        "task initiation, working memory, time awareness, organization, and consistent completion "
        "of multi-step work. The condition is chronic and becomes more impairing during lengthy, "
        "time-limited, or cognitively demanding tasks."
    ),
    "Prescribed treatment andor medications": (
        "Current treatment and medication regimen to be confirmed by the completing provider "
        "before signature."
    ),
    "Description of the current functional impact of the condition in the academic environment": (
        "In college, sustained lectures, independent assignments, and timed examinations require "
        "continuous attention over extended periods. When Chloe has an involuntary attention lapse, "
        "the clock continues to run although she is not able to access instructions, read and process "
        "questions, formulate responses, or monitor her work. Repeated lapses therefore reduce the "
        "usable time available on an examination and may leave work incomplete even when she knows "
        "the material. On longer assignments, the same symptoms cause loss of task continuity, "
        "inefficient restarts, and unpredictable reductions in productive work time, which can "
        "interfere with meeting deadlines despite advance planning and appropriate effort. These "
        "limitations affect concentrating, thinking, reading, learning, and completing academic work "
        "under standard time constraints. She previously received Section 504 supports in high school, "
        "including extended testing time and deadline flexibility. Extended testing time is directly "
        "related to the disability because it offsets time lost to documented attention lapses and "
        "allows her an equal opportunity to demonstrate knowledge without changing course standards. "
        "Limited flexibility with assignment deadlines, when symptoms materially interfere and when "
        "consistent with essential course requirements, would similarly address disability-related "
        "loss of productive time rather than reduce academic expectations."
    ),
    "Treatment Provider Name": "Sarah Spencer",
    "Treatment Provider Credentials": "LCSW-C",
    "License or Certification Number": "Maryland license #27309",
    "Treatment Provider Phone": "410-971-0118 (direct); 667-668-2566 (main)",
    "Treatment Provider Signature": "",
    "Date": "09/03/2026",
}


def set_field_appearance(field, font_size):
    field[NameObject("/DA")] = f"/Helv {font_size} Tf 0 g" if False else None


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(SOURCE)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)

    fields = writer.get_fields() or {}
    missing = set(VALUES) - set(fields)
    if missing:
        raise RuntimeError(f"Missing form fields: {sorted(missing)}")

    # Use compact auto-sized text. pypdf regenerates appearances for the existing
    # multiline fields while preserving the original two-page form.
    writer.update_page_form_field_values(
        None,
        VALUES,
        auto_regenerate=True,
    )

    with OUTPUT.open("wb") as f:
        writer.write(f)

    # Canonical field-value validation after reopening.
    check = PdfReader(OUTPUT)
    actual = check.get_fields() or {}
    for name, expected in VALUES.items():
        if name not in actual:
            raise RuntimeError(f"Field disappeared: {name}")
        observed = actual[name].get("/V") or ""
        if str(observed) != expected:
            raise RuntimeError(f"Value mismatch for {name!r}: {observed!r}")

    print(OUTPUT.resolve())


if __name__ == "__main__":
    main()
