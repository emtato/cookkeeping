# Frontend navigation plan

## Overall structure

Use four bottom tabs, in this order: **Home**, **Groceries**, **Plan**, and **Recipes**. These are the four places a user is likely to return to regularly. The order keeps the shopping list easy to reach while preserving the app's core flow: find or save a recipe, plan when to eat it, and see what to buy.

Each feature should have one main home. Home previews information and links to the relevant tab; it should not become a second place to maintain the meal plan or shopping list. A recipe's full details, a collection, or a cooking view can open from a tab without becoming another permanent bottom tab.

Start with the useful core of each tab. The larger ideas below describe where future features belong, not a requirement to build all of them at once. Keep room for them in the navigation and information structure without showing empty controls or claiming that unavailable information has been calculated.

## First usable workflow — the initial connected milestone

The first useful version should prove the app's central promise with one complete path from a recipe to a shopping list. Individual screens can be built in stages, but the milestone is complete only when information moves between them without the user copying it by hand.

1. In **Recipes**, the user saves a basic recipe with a name and ingredient list, including amounts and units where relevant. Manual entry is enough for this milestone; importing and AI extraction can come later.
2. In **Plan**, the user assigns that recipe to a date and meal slot. The plan shows which recipe is scheduled and lets the user open it again.
3. In **Groceries**, the planned recipe's ingredients appear automatically with their recorded quantities. The user can check off items while shopping. A manually added item can coexist with recipe-derived items.
4. The saved recipe, plan entry, shopping items, and checked states remain available when the user moves between tabs and returns to the app. If the planned meal is removed, its generated ingredients should no longer be treated as needed; unrelated manual items should remain.
5. **Home** can provide a simple preview of the next planned meal and remaining grocery items, with links to the owning tabs. More elaborate summaries and alerts can wait until the data behind them exists.

This milestone can be tested with one recipe and one planned meal. It does not need ingredient deduplication across recipes, unit conversion, pantry deductions, nutrition calculations, external imports, or meal recommendations. Those later features should build on the same recipe → plan → groceries connection.

## 1. Home — what matters now

Home is an overview of the user's cooking plans, rather than a separate planning workspace. It should let someone open the app and quickly understand what is coming up and what needs attention.

### Screen order and hierarchy

Use this order from top to bottom:

1. A compact welcome and at-a-glance summary.
2. A compact urgent alert, only when there is an actionable issue unrelated to the next meal.
3. **Up next**, showing the next one or two meals and any meal-specific readiness issues.
4. A predictable overview area with **Groceries** and **Later this week** preview cards.
5. A small row of recipe shortcuts.

The screen can scroll naturally. The welcome, meals, and previews should use the space their content needs, without fixed proportions of the screen or a permanent block reserved for alerts. Keep the welcome brief and the Up next content compact enough that the other useful previews are easy to reach.

### Welcome and summary

- Start with a short greeting, such as “Good afternoon,” and optionally the current day or date.
- Include a small amount of useful summary information when available. This area should orient the user quickly without repeating everything in the cards below.
- Keep it visually lighter and shorter than Up next, which is the main piece of information on the screen.

### Up next — the next one or two meals

- Show the next one or two scheduled meals. Each entry can include the recipe title, meal context such as lunch or dinner, its date or time, and an image when available.
- A short description or ingredient preview can help the user recognize the meal, but it should stay brief. Full ingredients and preparation instructions belong on the recipe detail screen.
- Give each meal a clear path to its recipe or plan entry. Home previews the meal; the Plan tab owns schedule changes and the recipe detail screen owns the full recipe.
- Put meal-specific warnings directly in the relevant meal card. For example, “Dinner tonight · missing 2 ingredients” can link to the grocery list. Seeing the meal and its readiness together makes the next action clear.

### Urgent information — show it where it is useful

- Do not place all urgent information in a separate Attention section at the bottom, where it could be missed.
- Keep warnings about an upcoming meal inside that meal's Up next card.
- If an urgent issue is unrelated to the next meal, show a compact alert just beneath the welcome area. For example, “Your spinach expires today” can lead to the relevant pantry information or action once that feature exists.
- Show only timely, actionable issues, with a clear explanation and a path to act. When there are no urgent issues, omit the alert area and let the remaining content move up.

### Overview area — the rest of the cooking week

Start with predictable cards in a stable order. This area gives a quick view of the grocery list and meals beyond those already shown in Up next.

**Groceries preview**

- Show a remaining-item summary, such as “4 items left to buy,” and a preview of two or three unpurchased items.
- Provide a clear link to the full Groceries tab for the rest of the list and shopping actions.
- A progress bar is useful only when its scope is clear. For example, label it “Groceries for this week's planned meals” if that is the set being measured. Do not imply that an undefined list or missing meal data represents the whole week's shopping.

**Later this week preview**

- Show a compact selection of planned meals beyond those already visible in Up next.
- Include enough date and meal context to remind the user what is coming, without repeating full recipe details.
- Link to Plan for the complete schedule and any changes.

Stack these preview cards vertically so meal names and grocery items have enough width. A two-by-two grid is better suited to short counts or buttons than these text previews. The overview cards should each have one clear purpose.

### Recipe shortcuts

Place recipe actions such as **Import recipe** and **Browse recipes** in a small row below the overview cards. These are quick actions and do not need the same amount of space as a preview containing information to read. Show actions as their functionality becomes available, and lead into Recipes for the full workflow.

### Empty states and later customization

- If there is no upcoming meal, provide a clear path to choose a recipe or plan a meal instead of an empty Up next card.
- If there is no grocery list or no later meal plan, show an appropriate starting action or omit an unhelpful preview. Do not display fabricated counts, progress, or warnings.
- User customization can come later: choosing which overview cards appear or reordering them. The initial default is the stable Groceries and Later this week overview, with recipe shortcuts below it.

Home alerts depend on real underlying features. Missing-ingredient notices require a link between the plan and grocery list; expiry notices require pantry or leftover tracking. They can be added as those features exist. Avoid turning Home into a general notification feed where important items get buried.

## 2. Groceries — what to buy

This tab owns the shopping list and is designed to be quick to use in a store.

- Initially, show a straightforward list with item names, quantities when known, and a clear checked or unchecked state. Manual items should be possible alongside items produced from a meal plan.
- As planning and recipes become connected, planned meals can contribute ingredients to **one consolidated list**. Shared ingredients should be combined where quantities and units can be resolved reliably. The user should still be able to add, change, remove, or ignore items when reality differs from the plan.
- An item can later reveal why it is on the list: which recipe or planned meal needs it. Checking it off should not obscure that connection.
- Later improvements belong here: grouping by aisle or category, shopping mode, household list sharing, receipt-assisted checking, and accounting for ingredients already in the pantry.

The grocery list is the result of the recipe-to-plan workflow, but it remains useful as a simple list before automatic generation is ready.

## 3. Plan — what and when to cook

This tab owns the schedule of future meals. A day-by-day view should make both planned dishes and unplanned or skipped meal slots easy to understand.

- Show dates in order, with meal slots such as breakfast, lunch, and dinner. A slot can contain a recipe, be left undecided, or be marked as skipped.
- A planned dish can show its name, image if available, a short description, and its planned serving amount. A compact ingredient or preparation preview may help, but full instructions and ingredient editing belong on the recipe detail screen.
- Tapping a meal opens its plan entry or recipe, where the user can inspect it and adjust the plan. The important action is choosing a dish and when to make it, with as little repeated entry as possible.
- In the first version, planning meals can be manual. Later, changing servings can recalculate required ingredients and update the grocery list. The plan can also account for leftovers, freezer meals, and what is already in the pantry.
- The proposed **Complete my week** feature belongs here. It can eventually suggest meals based on cost, effort, nutrition, ingredient overlap, and food that needs using soon, while explaining the reason for each suggestion.

Home may show the next meal, but the Plan tab remains the place to inspect and change the schedule.

## 4. Recipes — what to make

This tab owns the recipe library and entry points for finding or adding dishes. It should work first as a place to save and revisit recipes, then expand into discovery and import.

- The main view can show saved recipes, favourites, and user-created collections. Collections might be practical groupings such as quick meals, pasta, or desserts. Search and filters can help as the library grows.
- Opening a recipe shows its image, name, description, ingredients, amounts, instructions, and servings when available. The user can edit the recipe and adjust amounts from its detail view. A clear action can add it to the meal plan.
- Discovery, search, and import should be reachable from Recipes. They do not each need their own bottom tab. Later import sources could include URLs, screenshots, food photos, and videos; extracted information should be reviewable before being treated as a usable recipe.
- Future recipe details can include cuisine, user categories, dietary attributes, nutrition and macros, substitutions, and a focused cooking view with larger steps or timers. Nutrition can also be summarized across the Plan when that data exists.
- Recommendations based on the current plan or pantry belong here, with useful explanations such as shared ingredients or how little extra needs to be bought.

## No fifth tab yet

Do not add an empty fifth tab simply to leave room for future features. Macros and nutrition fit naturally within recipe details and the meal plan; pantry information can initially live with Groceries; timely reminders belong on Home. Settings and account actions can live outside the bottom navigation. Revisit a fifth tab only if a future feature becomes a distinct place users need to open frequently.

The long-term experience should still feel like one connected flow: **choose a recipe → plan a meal → get an accurate grocery list**. The four tabs make each stage easy to find, while Home shows the current state of the whole flow.
