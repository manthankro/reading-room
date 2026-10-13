export type Shelf = "story" | "essay" | "poem" | "letter";

export type Work = {
  slug: string;
  title: string;
  author: string;
  year: number;
  shelf: Shelf;
  paragraphs: string[];
};

export const works: Work[] = [
  {
    "slug": "the-story-of-an-hour",
    "title": "The Story of an Hour",
    "author": "Kate Chopin",
    "year": 1894,
    "shelf": "story",
    "paragraphs": [
      "Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband's death.",
      "It was her sister Josephine who told her, in broken sentences; veiled hints that revealed in half concealing. Her husband's friend Richards was there, too, near her. It was he who had been in the newspaper office when intelligence of the railroad disaster was received, with Brently Mallard's name leading the list of \"killed.\" He had only taken the time to assure himself of its truth by a second telegram, and had hastened to forestall any less careful, less tender friend in bearing the sad message.",
      "She did not hear the story as many women have heard the same, with a paralyzed inability to accept its significance. She wept at once, with sudden, wild abandonment, in her sister's arms. When the storm of grief had spent itself she went away to her room alone. She would have no one follow her.",
      "There stood, facing the open window, a comfortable, roomy armchair. Into this she sank, pressed down by a physical exhaustion that haunted her body and seemed to reach into her soul.",
      "She could see in the open square before her house the tops of trees that were all aquiver with the new spring life. The delicious breath of rain was in the air. In the street below a peddler was crying his wares. The notes of a distant song which some one was singing reached her faintly, and countless sparrows were twittering in the eaves. There were patches of blue sky showing here and there through the clouds that had met and piled one above the other in the west facing her window.",
      "She sat with her head thrown back upon the cushion of the chair, quite motionless, except when a sob came up into her throat and shook her, as a child who has cried itself to sleep continues to sob in its dreams.",
      "She was young, with a fair, calm face, whose lines bespoke repression and even a certain strength. But now there was a dull stare in her eyes, whose gaze was fixed away off yonder on one of those patches of blue sky. It was not a glance of reflection, but rather indicated a suspension of intelligent thought.",
      "There was something coming to her and she was waiting for it, fearfully. What was it? She did not know; it was too subtle and elusive to name. But she felt it, creeping out of the sky, reaching toward her through the sounds, the scents, the color that filled the air.",
      "Now her bosom rose and fell tumultuously. She was beginning to recognize this thing that was approaching to possess her, and she was striving to beat it back with her will — as powerless as her two white slender hands would have been. When she abandoned herself a little whispered word escaped her slightly parted lips. She said it over and over under her breath: \"free, free, free!\" The vacant stare and the look of terror that had followed it went from her eyes. They stayed keen and bright. Her pulses beat fast, and the coursing blood warmed and relaxed every inch of her body. She did not stop to ask if it were or were not a monstrous joy that held her.",
      "A clear and exalted perception enabled her to dismiss the suggestion as trivial.",
      "She knew that she would weep again when she saw the kind, tender hands folded in death; the face that had never looked save with love upon her, fixed and gray and dead. But she saw beyond that bitter moment a long procession of years to come that would belong to her absolutely. And she opened and spread her arms out to them in welcome. There would be no one to live for her during those coming years; she would live for herself. There would be no powerful will bending hers in that blind persistence with which men and women believe they have a right to impose a private will upon a fellow-creature.",
      "A kind intention or a cruel intention made the act seem no less a crime as she looked upon it in that brief moment of illumination.",
      "And yet she had loved him — sometimes. Often she had not. What did it matter! What could love, the unsolved mystery, count for in face of this possession of self-assertion which she suddenly recognized as the strongest impulse of her being!",
      "\"Free! Body and soul free!\" she kept whispering.",
      "Josephine was kneeling before the closed door with her lips to the keyhole, imploring for admission. \"Louise, open the door! I beg, open the door — you will make yourself ill. What are you doing, Louise? For heaven's sake open the door.\"",
      "\"Go away. I am not making myself ill.\" No; she was drinking in a very elixir of life through that open window. Her fancy was running riot along those days ahead of her. Spring days, and summer days, and all sorts of days that would be her own. She breathed a quick prayer that life might be long. It was only yesterday she had thought with a shudder that life might be long.",
      "She arose at length and opened the door to her sister's importunities. There was a feverish triumph in her eyes, and she carried herself unwittingly like a goddess of Victory. She clasped her sister's waist, and together they descended the stairs. Richards stood waiting for them at the bottom.",
      "Someone was opening the front door with a latchkey. It was Brently Mallard who entered, a little travel-stained, composedly carrying his grip-sack and umbrella. He had been far from the scene of the accident, and did not even know there had been one. He stood amazed at Josephine's piercing cry; at Richards' quick motion to screen him from the view of his wife.",
      "But Richards was too late.",
      "When the doctors came they said she had died of heart disease — of the joy that kills."
    ]
  },
  {
    "slug": "the-gift-of-the-magi",
    "title": "The Gift of the Magi",
    "author": "O. Henry",
    "year": 1905,
    "shelf": "story",
    "paragraphs": [
      "One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies. Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher until one’s cheeks burned with the silent imputation of parsimony that such close dealing implied. Three times Della counted it. One dollar and eighty-seven cents. And the next day would be Christmas.",
      "There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it. Which instigates the moral reflection that life is made up of sobs, sniffles, and smiles, with sniffles predominating.",
      "While the mistress of the home is gradually subsiding from the first stage to the second, take a look at the home. A furnished flat at $8 per week. It did not exactly beggar description, but it certainly had that word on the lookout for the mendicancy squad.",
      "In the vestibule below was a letter-box into which no letter would go, and an electric button from which no mortal finger could coax a ring. Also appertaining thereunto was a card bearing the name “Mr. James Dillingham Young.”",
      "The “Dillingham” had been flung to the breeze during a former period of prosperity when its possessor was being paid $30 per week. Now, when the income was shrunk to $20, the letters of “Dillingham” looked blurred, as though they were thinking seriously of contracting to a modest and unassuming D. But whenever Mr. James Dillingham Young came home and reached his flat above he was called “Jim” and greatly hugged by Mrs. James Dillingham Young, already introduced to you as Della. Which is all very good.",
      "Della finished her cry and attended to her cheeks with the powder rag. She stood by the window and looked out dully at a grey cat walking a grey fence in a grey backyard. To-morrow would be Christmas Day, and she had only $1.87 with which to buy Jim a present. She had been saving every penny she could for months, with this result. Twenty dollars a week doesn’t go far. Expenses had been greater than she had calculated. They always are. Only $1.87 to buy a present for Jim. Her Jim. Many a happy hour she had spent planning for something nice for him. Something fine and rare and sterling—something just a little bit near to being worthy of the honour of being owned by Jim.",
      "There was a pier-glass between the windows of the room. Perhaps you have seen a pier-glass in an $8 flat. A very thin and very agile person may, by observing his reflection in a rapid sequence of longitudinal strips, obtain a fairly accurate conception of his looks. Della, being slender, had mastered the art.",
      "Suddenly she whirled from the window and stood before the glass. Her eyes were shining brilliantly, but her face had lost its colour within twenty seconds. Rapidly she pulled down her hair and let it fall to its full length.",
      "Now, there were two possessions of the James Dillingham Youngs in which they both took a mighty pride. One was Jim’s gold watch that had been his father’s and his grandfather’s. The other was Della’s hair. Had the Queen of Sheba lived in the flat across the airshaft, Della would have let her hair hang out the window some day to dry just to depreciate Her Majesty’s jewels and gifts. Had King Solomon been the janitor, with all his treasures piled up in the basement, Jim would have pulled out his watch every time he passed, just to see him pluck at his beard from envy.",
      "So now Della’s beautiful hair fell about her, rippling and shining like a cascade of brown waters. It reached below her knee and made itself almost a garment for her. And then she did it up again nervously and quickly. Once she faltered for a minute and stood still while a tear or two splashed on the worn red carpet.",
      "On went her old brown jacket; on went her old brown hat. With a whirl of skirts and with the brilliant sparkle still in her eyes, she fluttered out the door and down the stairs to the street.",
      "Where she stopped the sign read: “Mme. Sofronie. Hair Goods of All Kinds.” One flight up Della ran, and collected herself, panting. Madame, large, too white, chilly, hardly looked the “Sofronie.”",
      "“Will you buy my hair?” asked Della.",
      "“I buy hair,” said Madame. “Take yer hat off and let’s have a sight at the looks of it.”",
      "Down rippled the brown cascade.",
      "“Twenty dollars,” said Madame, lifting the mass with a practised hand.",
      "“Give it to me quick,” said Della.",
      "Oh, and the next two hours tripped by on rosy wings. Forget the hashed metaphor. She was ransacking the stores for Jim’s present.",
      "She found it at last. It surely had been made for Jim and no one else. There was no other like it in any of the stores, and she had turned all of them inside out. It was a platinum fob chain simple and chaste in design, properly proclaiming its value by substance alone and not by meretricious ornamentation—as all good things should do. It was even worthy of The Watch. As soon as she saw it she knew that it must be Jim’s. It was like him. Quietness and value—the description applied to both. Twenty-one dollars they took from her for it, and she hurried home with the 87 cents. With that chain on his watch Jim might be properly anxious about the time in any company.",
      "Grand as the watch was, he sometimes looked at it on the sly on account of the old leather strap that he used in place of a chain.",
      "When Della reached home her intoxication gave way a little to prudence and reason. She got out her curling irons and lighted the gas and went to work repairing the ravages made by generosity added to love. Which is always a tremendous task, dear friends—a mammoth task.",
      "Within forty minutes her head was covered with tiny, close-lying curls that made her look wonderfully like a truant schoolboy. She looked at her reflection in the mirror long, carefully, and critically.",
      "“If Jim doesn’t kill me,” she said to herself, “before he takes a second look at me, he’ll say I look like a Coney Island chorus girl. But what could I do—oh! what could I do with a dollar and eighty-seven cents?”",
      "At 7 o’clock the coffee was made and the frying-pan was on the back of the stove hot and ready to cook the chops.",
      "Jim was never late. Della doubled the fob chain in her hand and sat on the corner of the table near the door that he always entered. Then she heard his step on the stair away down on the first flight, and she turned white for just a moment. She had a habit of saying little silent prayers about the simplest everyday things, and now she whispered: “Please God, make him think I am still pretty.”",
      "The door opened and Jim stepped in and closed it. He looked thin and very serious. Poor fellow, he was only twenty-two—and to be burdened with a family! He needed a new overcoat and he was without gloves.",
      "Jim stopped inside the door, as immovable as a setter at the scent of quail. His eyes were fixed upon Della, and there was an expression in them that she could not read, and it terrified her. It was not anger, nor surprise, nor disapproval, nor horror, nor any of the sentiments that she had been prepared for. He simply stared at her fixedly with that peculiar expression on his face.",
      "Della wriggled off the table and went for him.",
      "“Jim, darling,” she cried, “don’t look at me that way. I had my hair cut off and sold it because I couldn’t have lived through Christmas without giving you a present. It’ll grow out again—you won’t mind, will you? I just had to do it. My hair grows awfully fast. Say ‘Merry Chistmas!’ Jim, and let’s be happy. You don’t know what a nice—what a beautiful, nice gift I’ve got for you.”",
      "“You’ve cut off your hair?” asked Jim, laboriously, as if he had not arrived at that patent fact yet even after the hardest mental labour.",
      "“Cut it off and sold it,” said Della. “Don’t you like me just as well, anyhow? I’m me without my hair, ain’t I?”",
      "Jim looked about the room curiously.",
      "“You say your hair is gone?” he said, with an air almost of idiocy.",
      "“You needn’t look for it,” said Della. “It’s sold, I tell you—sold and gone, too. It’s Christmas Eve, boy. Be good to me, for it went for you. Maybe the hairs of my head were numbered,” she went on with a sudden serious sweetness, “but nobody could ever count my love for you. Shall I put the chops on, Jim?”",
      "Out of his trance Jim seemed quickly to wake. He enfolded his Della. For ten seconds let us regard with discreet scrutiny some inconsequential object in the other direction. Eight dollars a week or a million a year—what is the difference? A mathematician or a wit would give you the wrong answer. The magi brought valuable gifts, but that was not among them. This dark assertion will be illuminated later on.",
      "Jim drew a package from his overcoat pocket and threw it upon the table.",
      "“Don’t make any mistake, Dell,” he said, “about me. I don’t think there’s anything in the way of a haircut or a shave or a shampoo that could make me like my girl any less. But if you’ll unwrap that package you may see why you had me going a while at first.”",
      "White fingers and nimble tore at the string and paper. And then an ecstatic scream of joy; and then, alas! a quick feminine change to hysterical tears and wails, necessitating the immediate employment of all the comforting powers of the lord of the flat.",
      "For there lay The Combs—the set of combs, side and back, that Della had worshipped for long in a Broadway window. Beautiful combs, pure tortoise shell, with jewelled rims—just the shade to wear in the beautiful vanished hair. They were expensive combs, she knew, and her heart had simply craved and yearned over them without the least hope of possession. And now, they were hers, but the tresses that should have adorned the coveted adornments were gone.",
      "But she hugged them to her bosom, and at length she was able to look up with dim eyes and a smile and say: “My hair grows so fast, Jim!”",
      "And then Della leaped up like a little singed cat and cried, “Oh, oh!”",
      "Jim had not yet seen his beautiful present. She held it out to him eagerly upon her open palm. The dull precious metal seemed to flash with a reflection of her bright and ardent spirit.",
      "“Isn’t it a dandy, Jim? I hunted all over town to find it. You’ll have to look at the time a hundred times a day now. Give me your watch. I want to see how it looks on it.”",
      "Instead of obeying, Jim tumbled down on the couch and put his hands under the back of his head and smiled.",
      "“Dell,” said he, “let’s put our Christmas presents away and keep ’em a while. They’re too nice to use just at present. I sold the watch to get the money to buy your combs. And now suppose you put the chops on.”",
      "The magi, as you know, were wise men—wonderfully wise men—who brought gifts to the Babe in the manger. They invented the art of giving Christmas presents. Being wise, their gifts were no doubt wise ones, possibly bearing the privilege of exchange in case of duplication. And here I have lamely related to you the uneventful chronicle of two foolish children in a flat who most unwisely sacrificed for each other the greatest treasures of their house. But in a last word to the wise of these days let it be said that of all who give gifts these two were the wisest. Of all who give and receive gifts, such as they are wisest. Everywhere they are wisest. They are the magi."
    ]
  },
  {
    "slug": "the-tell-tale-heart",
    "title": "The Tell-Tale Heart",
    "author": "Edgar Allan Poe",
    "year": 1843,
    "shelf": "story",
    "paragraphs": [
      "True! nervous, very, very dreadfully nervous I had been and am; but why will you say that I am mad? The disease had sharpened my senses, not destroyed, not dulled them. Above all was the sense of hearing acute. I heard all things in the heaven and in the earth. I heard many things in hell. How then am I mad? Hearken! and observe how healthily, how calmly I can tell you the whole story.",
      "It is impossible to say how first the idea entered my brain, but, once conceived, it haunted me day and night. Object there was none. Passion there was none. I loved the old man. He had never wronged me. He had never given me insult. For his gold I had no desire. I think it was his eye! Yes, it was this! One of his eyes resembled that of a vulture—a pale blue eye with a film over it. Whenever it fell upon me my blood ran cold, and so by degrees, very gradually, I made up my mind to take the life of the old man, and thus rid myself of the eye forever.",
      "Now this is the point. You fancy me mad. Madmen know nothing. But you should have seen me. You should have seen how wisely I proceeded; with what caution, with what foresight, with what dissimulation, I went to work! I was never kinder to the old man than during the whole week before I killed him. And every night about midnight I turned the latch of his door and opened it—oh, so gently! And then when I had made an opening sufficient for my head I put in a dark lantern all closed, closed so that no light shone out, and then I thrust in my head. Oh, you would have laughed to see how cunningly I thrust it in!",
      "I moved it slowly, very, very slowly, so that I might not disturb the old man's sleep. It took me an hour to place my whole head within the opening so far that I could see him as he lay upon his bed. Ha! would a madman have been so wise as this? And then when my head was well in the room I undid the lantern cautiously—oh, so cautiously—cautiously (for the hinges creaked), I undid it just so much that a single thin ray fell upon the vulture eye.",
      "And this I did for seven long nights, every night just at midnight, but I found the eye always closed, and so it was impossible to do the work, for it was not the old man who vexed me, but his Evil Eye. And every morning, when the day broke, I went boldly into the chamber and spoke courageously to him, calling him by name in a hearty tone, and inquiring how he had passed the night. So you see he would have been a very profound old man, indeed, to suspect that every night, just at twelve, I looked in upon him while he slept.",
      "Upon the eighth night I was more than usually cautious in opening the door. A watch's minute hand moves more quickly than did mine. Never before that night had I felt the extent of my own powers, of my sagacity. I could scarcely contain my feelings of triumph. To think that there I was opening the door little by little, and he not even to dream of my secret deeds or thoughts. I fairly chuckled at the idea, and perhaps he heard me, for he moved on the bed suddenly as if startled. Now you may think that I drew back—but no.",
      "His room was as black as pitch with the thick darkness (for the shutters were close fastened through fear of robbers), and so I knew that he could not see the opening of the door, and I kept pushing it on steadily, steadily.",
      "I had my head in, and was about to open the lantern when my thumb slipped upon the tin fastening, and the old man sprang up in the bed, crying out, \"Who's there?\"",
      "I kept quite still and said nothing. For a whole hour I did not move a muscle, and in the meantime I did not hear him lie down. He was still sitting up in the bed, listening; just as I have done night after night hearkening to the death watches in the wall.",
      "Presently I heard a slight groan, and I knew it was the groan of mortal terror. It was not a groan of pain or of grief—oh, no! it was the low stifled sound that arises from the bottom of the soul when overcharged with awe. I knew the sound well. Many a night, just at midnight, when all the world slept, it has welled up from my own bosom, deepening, with its dreadful echo, the terrors that distracted me. I say I knew it well. I knew what the old man felt, and pitied him, although I chuckled at heart. I knew that he had been lying awake ever since the first slight noise when he had turned in the bed. His fears had been ever since growing upon him.",
      "He had been trying to fancy them causeless, but could not. He had been saying to himself, \"It is nothing but the wind in the chimney, it is only a mouse crossing the floor,\" or \"It is merely a cricket which has made a single chirp.\" Yes, he has been trying to comfort himself with these suppositions; but he had found all in vain. All in vain, because Death in approaching him had stalked with his black shadow before him and enveloped the victim. And it was the mournful influence of the unperceived shadow that caused him to feel, although he neither saw nor heard, to feel the presence of my head within the room.",
      "When I had waited a long time very patiently without hearing him lie down, I resolved to open a little—a very, very little crevice in the lantern. So I opened it—you cannot imagine how stealthily—until at length a single dim ray like the thread of the spider shot out from the crevice and fell upon the vulture eye.",
      "It was open, wide, wide open, and I grew furious as I gazed upon it. I saw it with perfect distinctness—all a dull blue with a hideous veil over it that chilled the very marrow in my bones, but I could see nothing else of the old man's face or person, for I had directed the ray as if by instinct precisely upon the damned spot.",
      "And now have I not told you that what you mistake for madness is but over-acuteness of the senses? now, I say, there came to my ears a low, dull, quick sound, such as a watch makes when enveloped in cotton. I knew that sound well, too. It was the beating of the old man's heart. It increased my fury, as the beating of a drum stimulates the soldier into courage.",
      "But even yet I refrained and kept still. I scarcely breathed. I held the lantern motionless. I tried how steadily I could maintain the ray upon the eye. Meantime the hellish tattoo of the heart increased. It grew quicker and quicker, and louder and louder, every instant. The old man's terror must have been extreme! It grew louder, I say, louder every moment!—do you mark me well? I have told you that I am nervous: so I am. And now at the dead hour of the night, amid the dreadful silence of that old house, so strange a noise as this excited me to uncontrollable terror. Yet, for some minutes longer I refrained and stood still. But the beating grew louder, louder! I thought the heart must burst.",
      "And now a new anxiety seized me—the sound would be heard by a neighbor! The old man's hour had come! With a loud yell, I threw open the lantern and leaped into the room. He shrieked once—once only. In an instant I dragged him to the floor, and pulled the heavy bed over him. I then smiled gaily, to find the deed so far done. But for many minutes the heart beat on with a muffled sound. This, however, did not vex me; it would not be heard through the wall. At length it ceased. The old man was dead. I removed the bed and examined the corpse. Yes, he was stone, stone dead. I placed my hand upon the heart and held it there many minutes.",
      "There was no pulsation. He was stone dead. His eye would trouble me no more.",
      "If still you think me mad, you will think so no longer when I describe the wise precautions I took for the concealment of the body. The night waned, and I worked hastily, but in silence.",
      "I took up three planks from the flooring of the chamber, and deposited all between the scantlings. I then replaced the boards so cleverly, so cunningly, that no human eye—not even his—could have detected anything wrong. There was nothing to wash out—no stain of any kind—no bloodspot whatever. I had been too wary for that.",
      "When I had made an end of these labors, it was four o'clock—still dark as midnight. As the bell sounded the hour, there came a knocking at the street door. I went down to open it with a light heart—for what had I now to fear? There entered three men, who introduced themselves, with perfect suavity, as officers of the police. A shriek had been heard by a neighbor during the night; suspicion of foul play had been aroused; information had been lodged at the police office, and they (the officers) had been deputed to search the premises.",
      "I smiled—for what had I to fear? I bade the gentlemen welcome. The shriek, I said, was my own in a dream. The old man, I mentioned, was absent in the country. I took my visitors all over the house. I bade them search—search well. I led them, at length, to his chamber. I showed them his treasures, secure, undisturbed. In the enthusiasm of my confidence, I brought chairs into the room, and desired them here to rest from their fatigues, while I myself, in the wild audacity of my perfect triumph, placed my own seat upon the very spot beneath which reposed the corpse of the victim.",
      "The officers were satisfied. My manner had convinced them. I was singularly at ease. They sat, and while I answered cheerily, they chatted of familiar things. But, ere long, I felt myself getting pale and wished them gone. My head ached, and I fancied a ringing in my ears; but still they sat, and still chatted. The ringing became more distinct;—it continued and became more distinct. I talked more freely to get rid of the feeling, but it continued and gained definitiveness—until, at length, I found that the noise was not within my ears.",
      "No doubt I now grew very pale; but I talked more fluently and with a heightened voice. Yet the sound increased—and what could I do? It was a low, dull, quick sound—much such a sound as a watch makes when enveloped in cotton. I gasped for breath—and yet the officers heard it not. I talked more quickly—more vehemently; but the noise steadily increased. I arose and argued about trifles, in a high key and with violent gesticulations; but the noise steadily increased. Why would they not be gone? I paced the floor to and fro with heavy strides, as if excited to fury by the observations of the men—but the noise steadily increased. O God! what could I do? I foamed—I raved—I swore!",
      "I swung the chair upon which I had been sitting, and grated it upon the boards, but the noise arose over all and continually increased. It grew louder—louder—louder! And still the men chatted pleasantly, and smiled. Was it possible they heard not? Almighty God!—no, no! They heard!—they suspected!—they knew!—they were making a mockery of my horror!—this I thought, and this I think. But anything was better than this agony! Anything was more tolerable than this derision! I could bear those hypocritical smiles no longer! I felt that I must scream or die!—and now—again!—hark! louder! louder! louder! louder!",
      "\"Villains!\" I shrieked, \"dissemble no more! I admit the deed!—tear up the planks!—here, here!—it is the beating of his hideous heart!\""
    ]
  },
  {
    "slug": "the-bet",
    "title": "The Bet",
    "author": "Anton Chekhov",
    "year": 1889,
    "shelf": "story",
    "paragraphs": [
      "It was a dark autumn night. The old banker was walking up and down his study and remembering how, fifteen years before, he had given a party one autumn evening. There had been many clever men there, and there had been interesting conversations. Among other things they had talked of capital punishment. The majority of the guests, among whom were many journalists and intellectual men, disapproved of the death penalty. They considered that form of punishment out of date, immoral, and unsuitable for Christian States. In the opinion of some of them the death penalty ought to be replaced everywhere by imprisonment for life. \"I don't agree with you,\" said their host the banker.",
      "\"I have not tried either the death penalty or imprisonment for life, but if one may judge a priori, the death penalty is more moral and more humane than imprisonment for life. Capital punishment kills a man at once, but lifelong imprisonment kills him slowly. Which executioner is the more humane, he who kills you in a few minutes or he who drags the life out of you in the course of many years?\"",
      "\"Both are equally immoral,\" observed one of the guests, \"for they both have the same object - to take away life. The State is not God. It has not the right to take away what it cannot restore when it wants to.\"",
      "Among the guests was a young lawyer, a young man of five-and-twenty. When he was asked his opinion, he said:",
      "\"The death sentence and the life sentence are equally immoral, but if I had to choose between the death penalty and imprisonment for life, I would certainly choose the second. To live anyhow is better than not at all.\"",
      "A lively discussion arose. The banker, who was younger and more nervous in those days, was suddenly carried away by excitement; he struck the table with his fist and shouted at the young man:",
      "\"It's not true! I'll bet you two million you wouldn't stay in solitary confinement for five years.\"",
      "\"If you mean that in earnest,\" said the young man, \"I'll take the bet, but I would stay not five but fifteen years.\"",
      "\"Fifteen? Done!\" cried the banker. \"Gentlemen, I stake two million!\"",
      "\"Agreed! You stake your millions and I stake my freedom!\" said the young man.",
      "And this wild, senseless bet was carried out! The banker, spoilt and frivolous, with millions beyond his reckoning, was delighted at the bet. At supper he made fun of the young man, and said:",
      "\"Think better of it, young man, while there is still time. To me two million is a trifle, but you are losing three or four of the best years of your life. I say three or four, because you won't stay longer. Don't forget either, you unhappy man, that voluntary confinement is a great deal harder to bear than compulsory. The thought that you have the right to step out in liberty at any moment will poison your whole existence in prison. I am sorry for you.\"",
      "And now the banker, walking to and fro, remembered all this, and asked himself: \"What was the object of that bet? What is the good of that man's losing fifteen years of his life and my throwing away two million? Can it prove that the death penalty is better or worse than imprisonment for life? No, no. It was all nonsensical and meaningless. On my part it was the caprice of a pampered man, and on his part simple greed for money ...\"",
      "Then he remembered what followed that evening. It was decided that the young man should spend the years of his captivity under the strictest supervision in one of the lodges in the banker's garden. It was agreed that for fifteen years he should not be free to cross the threshold of the lodge, to see human beings, to hear the human voice, or to receive letters and newspapers. He was allowed to have a musical instrument and books, and was allowed to write letters, to drink wine, and to smoke. By the terms of the agreement, the only relations he could have with the outer world were by a little window made purposely for that object.",
      "He might have anything he wanted - books, music, wine, and so on - in any quantity he desired by writing an order, but could only receive them through the window. The agreement provided for every detail and every trifle that would make his imprisonment strictly solitary, and bound the young man to stay there exactly fifteen years, beginning from twelve o'clock of November 14, 1870, and ending at twelve o'clock of November 14, 1885. The slightest attempt on his part to break the conditions, if only two minutes before the end, released the banker from the obligation to pay him the two million.",
      "For the first year of his confinement, as far as one could judge from his brief notes, the prisoner suffered severely from loneliness and depression. The sounds of the piano could be heard continually day and night from his lodge. He refused wine and tobacco. Wine, he wrote, excites the desires, and desires are the worst foes of the prisoner; and besides, nothing could be more dreary than drinking good wine and seeing no one. And tobacco spoilt the air of his room. In the first year the books he sent for were principally of a light character; novels with a complicated love plot, sensational and fantastic stories, and so on.",
      "In the second year the piano was silent in the lodge, and the prisoner asked only for the classics. In the fifth year music was audible again, and the prisoner asked for wine. Those who watched him through the window said that all that year he spent doing nothing but eating and drinking and lying on his bed, frequently yawning and angrily talking to himself. He did not read books. Sometimes at night he would sit down to write; he would spend hours writing, and in the morning tear up all that he had written. More than once he could be heard crying.",
      "In the second half of the sixth year the prisoner began zealously studying languages, philosophy, and history. He threw himself eagerly into these studies - so much so that the banker had enough to do to get him the books he ordered. In the course of four years some six hundred volumes were procured at his request. It was during this period that the banker received the following letter from his prisoner:",
      "\"My dear Jailer, I write you these lines in six languages. Show them to people who know the languages. Let them read them. If they find not one mistake I implore you to fire a shot in the garden. That shot will show me that my efforts have not been thrown away. The geniuses of all ages and of all lands speak different languages, but the same flame burns in them all. Oh, if you only knew what unearthly happiness my soul feels now from being able to understand them!\" The prisoner's desire was fulfilled. The banker ordered two shots to be fired in the garden.",
      "Then after the tenth year, the prisoner sat immovably at the table and read nothing but the Gospel. It seemed strange to the banker that a man who in four years had mastered six hundred learned volumes should waste nearly a year over one thin book easy of comprehension. Theology and histories of religion followed the Gospels.",
      "In the last two years of his confinement the prisoner read an immense quantity of books quite indiscriminately. At one time he was busy with the natural sciences, then he would ask for Byron or Shakespeare. There were notes in which he demanded at the same time books on chemistry, and a manual of medicine, and a novel, and some treatise on philosophy or theology. His reading suggested a man swimming in the sea among the wreckage of his ship, and trying to save his life by greedily clutching first at one spar and then at another.",
      "The old banker remembered all this, and thought:",
      "\"To-morrow at twelve o'clock he will regain his freedom. By our agreement I ought to pay him two million. If I do pay him, it is all over with me: I shall be utterly ruined.\"",
      "Fifteen years before, his millions had been beyond his reckoning; now he was afraid to ask himself which were greater, his debts or his assets. Desperate gambling on the Stock Exchange, wild speculation and the excitability which he could not get over even in advancing years, had by degrees led to the decline of his fortune and the proud, fearless, self-confident millionaire had become a banker of middling rank, trembling at every rise and fall in his investments. \"Cursed bet!\" muttered the old man, clutching his head in despair \"Why didn't the man die? He is only forty now.",
      "He will take my last penny from me, he will marry, will enjoy life, will gamble on the Exchange; while I shall look at him with envy like a beggar, and hear from him every day the same sentence: 'I am indebted to you for the happiness of my life, let me help you!' No, it is too much! The one means of being saved from bankruptcy and disgrace is the death of that man!\"",
      "It struck three o'clock, the banker listened; everyone was asleep in the house and nothing could be heard outside but the rustling of the chilled trees. Trying to make no noise, he took from a fireproof safe the key of the door which had not been opened for fifteen years, put on his overcoat, and went out of the house.",
      "It was dark and cold in the garden. Rain was falling. A damp cutting wind was racing about the garden, howling and giving the trees no rest. The banker strained his eyes, but could see neither the earth nor the white statues, nor the lodge, nor the trees. Going to the spot where the lodge stood, he twice called the watchman. No answer followed. Evidently the watchman had sought shelter from the weather, and was now asleep somewhere either in the kitchen or in the greenhouse.",
      "\"If I had the pluck to carry out my intention,\" thought the old man, \"Suspicion would fall first upon the watchman.\"",
      "He felt in the darkness for the steps and the door, and went into the entry of the lodge. Then he groped his way into a little passage and lighted a match. There was not a soul there. There was a bedstead with no bedding on it, and in the corner there was a dark cast-iron stove. The seals on the door leading to the prisoner's rooms were intact.",
      "When the match went out the old man, trembling with emotion, peeped through the little window. A candle was burning dimly in the prisoner's room. He was sitting at the table. Nothing could be seen but his back, the hair on his head, and his hands. Open books were lying on the table, on the two easy-chairs, and on the carpet near the table.",
      "Five minutes passed and the prisoner did not once stir. Fifteen years' imprisonment had taught him to sit still. The banker tapped at the window with his finger, and the prisoner made no movement whatever in response. Then the banker cautiously broke the seals off the door and put the key in the keyhole. The rusty lock gave a grating sound and the door creaked. The banker expected to hear at once footsteps and a cry of astonishment, but three minutes passed and it was as quiet as ever in the room. He made up his mind to go in.",
      "At the table a man unlike ordinary people was sitting motionless. He was a skeleton with the skin drawn tight over his bones, with long curls like a woman's and a shaggy beard. His face was yellow with an earthy tint in it, his cheeks were hollow, his back long and narrow, and the hand on which his shaggy head was propped was so thin and delicate that it was dreadful to look at it. His hair was already streaked with silver, and seeing his emaciated, aged-looking face, no one would have believed that he was only forty. He was asleep ... In front of his bowed head there lay on the table a sheet of paper on which there was something written in fine handwriting.",
      "\"Poor creature!\" thought the banker, \"he is asleep and most likely dreaming of the millions. And I have only to take this half-dead man, throw him on the bed, stifle him a little with the pillow, and the most conscientious expert would find no sign of a violent death. But let us first read what he has written here ... \"",
      "The banker took the page from the table and read as follows:",
      "\"To-morrow at twelve o'clock I regain my freedom and the right to associate with other men, but before I leave this room and see the sunshine, I think it necessary to say a few words to you. With a clear conscience I tell you, as before God, who beholds me, that I despise freedom and life and health, and all that in your books is called the good things of the world.",
      "\"For fifteen years I have been intently studying earthly life. It is true I have not seen the earth nor men, but in your books I have drunk fragrant wine, I have sung songs, I have hunted stags and wild boars in the forests, have loved women ... Beauties as ethereal as clouds, created by the magic of your poets and geniuses, have visited me at night, and have whispered in my ears wonderful tales that have set my brain in a whirl. In your books I have climbed to the peaks of Elburz and Mont Blanc, and from there I have seen the sun rise and have watched it at evening flood the sky, the ocean, and the mountain-tops with gold and crimson.",
      "I have watched from there the lightning flashing over my head and cleaving the storm-clouds. I have seen green forests, fields, rivers, lakes, towns. I have heard the singing of the sirens, and the strains of the shepherds' pipes; I have touched the wings of comely devils who flew down to converse with me of God ... In your books I have flung myself into the bottomless pit, performed miracles, slain, burned towns, preached new religions, conquered whole kingdoms ...",
      "\"Your books have given me wisdom. All that the unresting thought of man has created in the ages is compressed into a small compass in my brain. I know that I am wiser than all of you.",
      "\"And I despise your books, I despise wisdom and the blessings of this world. It is all worthless, fleeting, illusory, and deceptive, like a mirage. You may be proud, wise, and fine, but death will wipe you off the face of the earth as though you were no more than mice burrowing under the floor, and your posterity, your history, your immortal geniuses will burn or freeze together with the earthly globe.",
      "\"You have lost your reason and taken the wrong path. You have taken lies for truth, and hideousness for beauty. You would marvel if, owing to strange events of some sorts, frogs and lizards suddenly grew on apple and orange trees instead of fruit, or if roses began to smell like a sweating horse; so I marvel at you who exchange heaven for earth. I don't want to understand you.",
      "\"To prove to you in action how I despise all that you live by, I renounce the two million of which I once dreamed as of paradise and which now I despise. To deprive myself of the right to the money I shall go out from here five hours before the time fixed, and so break the compact ...\"",
      "When the banker had read this he laid the page on the table, kissed the strange man on the head, and went out of the lodge, weeping. At no other time, even when he had lost heavily on the Stock Exchange, had he felt so great a contempt for himself. When he got home he lay on his bed, but his tears and emotion kept him for hours from sleeping.",
      "Next morning the watchmen ran in with pale faces, and told him they had seen the man who lived in the lodge climb out of the window into the garden, go to the gate, and disappear. The banker went at once with the servants to the lodge and made sure of the flight of his prisoner. To avoid arousing unnecessary talk, he took from the table the writing in which the millions were renounced, and when he got home locked it up in the fireproof safe."
    ]
  },
  {
    "slug": "of-studies",
    "title": "Of Studies",
    "author": "Francis Bacon",
    "year": 1625,
    "shelf": "essay",
    "paragraphs": [
      "Studies serve for delight, for ornament and for ability. Their chief use for delight, is in privateness and retiring; for ornament, is in discourse; and for ability, is in the judgment and disposition of business; for expert men can execute, and perhaps judge of particulars, one by one: but the general counsels, and the plots and marshalling of affairs come best from those that are learned.",
      "To spend too much time in studies, is sloth; to use them too much for ornament, is affectation; to make judgment wholly by their rules, is the humour of a scholar: they perfect nature, and are perfected by experience: for natural abilities are like natural plants, that need pruning by study; and studies themselves do give forth directions too much at large, except they be bounded in by experience. Crafty men contemn studies, simple men admire them, and wise men use them; for they teach not their own use; but that is a wisdom without them, and above them, won by observation. Read not to contradict and confute, nor to believe and take for granted, nor to find talk and discourse, but to weigh and consider.",
      "Some books are to be tasted, others to be swallowed, and some few to be chewed and digested; that is, some books are to be read only in parts; others to be read, but not curiously; and some few to be read wholly, and with diligence and attention. Some books also may be read by deputy, and extracts made of them by others; but that would be only in the less important arguments, and the meaner sort of books; else distilled books are, like common distilled waters, flashy things.",
      "Reading maketh a full man; conference a ready man; and writing an exact man; and, therefore, if a man write little, he had need have a great memory; if he confer little, he had need have a present wit: and if he read little, he had need have much cunning, to seem to know that he doth not.",
      "Histories make men wise; poets witty; the mathematics subtile; natural philosophy deep; moral, grave; logic and rhetoric, able to contend; \"Abeunt studia in mores;\" nay, there is no stond or impediment in the wit, but may be wrought out by fit studies: like as diseases of the body may have appropriate exercises; bowling is good for the stone and reins, shooting for the lungs and breast, gentle walking for the stomach, riding for the head, and the like; so, if a man's wit be wandering, let him study the mathematics; for in demonstrations, if his wit be called away never so little, he must begin again; if his wit be not apt to distinguish or find differences, let him study the schoolmen, for they are \"Cymini sectores;\" if he be not apt to beat over matters, and to call upon one thing to prove and illustrate another, let him study the lawyer's cases: so every defect of the mind may have a special receipt."
    ]
  },
  {
    "slug": "the-morals-of-chess",
    "title": "The Morals of Chess",
    "author": "Benjamin Franklin",
    "year": 1786,
    "shelf": "essay",
    "paragraphs": [
      "Playing at Chess, is the most ancient and universal game known among men; for its original is beyond the memory of history, and it has, for numberless ages, been the amusement of all the civilized nations of Asia, the Persians, the Indians, and the Chinese. Europe has had it above 1,000 years; the Spaniards have spread it over their part of America, and it begins lately to make its appearance in these northern states. It is so interesting in itself, as not to need the view of gain to induce engaging in it; and thence it is never played for money.",
      "Those, therefore, who have leisure for such diversions, cannot find one that is more innocent; and the following piece, written with a view to correct (among a few young friends) some little improprieties in the practice of it, shows at the same time that it may, in its effects on the mind, be not merely innocent, but advantageous, to the vanquished as well as to the victor.",
      "The game of Chess is not merely an idle amusement. Several very valuable qualities of the mind, useful in the course of human life, are to be acquired or strengthened by it, so as to become habits, ready on all occasions. For life is a kind of chess, in which we have often points to gain, and competitors or adversaries to contend with, and in which there is a vast variety of good and ill events, that are, in some degree, the effects of prudence or the want of it.",
      "By playing at chess, then, we may learn:",
      "1. Foresight, which looks a little into futurity, and considers the consequences that may attend an action: for it is continually occurring to the player, \"If I move this piece, what will be the advantages of my new situation? What use can my adversary make of it to annoy me? What other moves can I make to support it, and to defend myself from his attacks?\"",
      "2. Circumspection, which surveys the whole chess-board, or scene of action, the relations of the several pieces and situations, the dangers they are respectively exposed to, the several possibilities of their aiding each other, the probabilities that the opponent may make this or that move, and attack this or the other piece; and what different means can be used to avoid his stroke, or turn its consequences against him.",
      "3. Caution, not to make our moves too hastily. This habit is best acquired by observing strictly the laws of the game, such as, \"If you touch a piece, you must move it somewhere; if you set it down, you must let it stand.\" And it is therefore best that these rules should be observed, as the game thereby becomes more the image of human life, and particularly of war; in which, if you have incautiously put yourself into a bad and dangerous position, you cannot obtain your enemy's leave to withdraw your troops, and place them more securely; but you must abide all the consequences of your rashness.",
      "And lastly, we learn by chess the habit of not being discouraged by present bad appearances in the state of our affairs, the habit of hoping for a favorable change, and that of persevering in the search of resources. The game is so full of events, there is such a variety of turns in it, the fortune of it is so subject to sudden vicissitudes, and one so frequently, after long contemplation, discovers the means of extricating one's self from a supposed insurmountable difficulty, that one is encouraged to continue the contest to the last, in hopes of victory by our own skill, or, at least, of giving a stalemate, by the negligence of our adversary.",
      "And whoever considers, what in chess he often sees instances of, that particular pieces of success are apt to produce presumption, and its consequent, inattention, by which more is afterwards lost than was gained by the preceding advantage; while misfortunes produce more care and attention, by which the loss may be recovered, will learn not to be too much discouraged by the present success of his adversary, nor to despair of final good fortune, upon every little check he receives in the pursuit of it.",
      "That we may, therefore, be induced more frequently to choose this beneficial amusement, in preference to others which are not attended with the same advantages, every circumstance, that may encrease the pleasure of it, should be regarded; and every action or word that is unfair, disrespectful, or that in any way may give uneasiness, should be avoided, as contrary to the immediate intention of both the players, which is, to pass the time agreeably.",
      "Therefore, 1st. If it is agreed to play according to the strict rules, then those rules are to be exactly observed by both parties; and should not be insisted on for one side, while deviated from by the other: for this is not equitable.",
      "2. If it is agreed not to observe the rules exactly, but one party demands indulgencies, he should then be as willing to allow them to the other.",
      "3. No false move should ever be made to extricate yourself out of a difficulty, or to gain an advantage. There can be no pleasure in playing with a person once detected in such unfair practice.",
      "4. If your adversary is long in playing, you ought not to hurry him, or express any uneasiness at his delay. You should not sing, nor whistle, nor look at your watch, nor take up a book to read, nor make a tapping with your feet on the floor, or with your fingers on the table, nor do any thing that may disturb his attention. For all these things displease. And they do not show your skill in playing, but your craftiness or your rudeness.",
      "5. You ought not to endeavour to amuse and deceive your adversary, by pretending to have made bad moves, and saying you have now lost the game, in order to make him secure and careless, and inattentive to your schemes; for this is fraud, and deceit, not skill in the game.",
      "6. You must not, when you have gained a victory, use any triumphing or insulting expression, nor show too much pleasure; but endeavour to console your adversary, and make him less dissatisfied with himself by every kind and civil expression, that may be used with truth; such as, You understand the game better than I, but you are a little inattentive; or, You play too fast; or, You had the best of the game, but something happened to divert your thoughts, and that turned it in my favour.\"",
      "7. If you are a spectator, while others play, observe the most perfect silence. For if you give advice, you offend both parties; him, against whom you give it, because it may cause the loss of his game; him, in whose favour you give it; because, tho' it be good, and he follows it, he loses the pleasure he might have had, if you had permitted him to think till it occurred to himself. Even after a move or moves, you must not, by replacing the pieces, show how it might have been played better: for that displeases, and may occasion disputes or doubts about their true situation.",
      "All talking to the players, lessens or diverts their attention, and is therefore unpleasing; nor should you give the least hint to either party, by any kind of noise or motion.—If you do, you are unworthy to be a spectator.—If you have a mind to exercise or show your judgment, do it in playing your own game when you have an opportunity, not in criticising or meddling with, or counselling, the play of others.",
      "Lastly. If the game is not to be played rigorously, according to the rules above mentioned, then moderate your desire of victory over your adversary, and be pleased with one over yourself. Snatch not eagerly at every advantage offered by his unskilfulness or inattention; but point out to him kindly that by such a move he places or leaves a piece in danger and unsupported; that by another he will put his king in a dangerous situation, &c. By this generous civility (so opposite to the unfairness above forbidden) you may indeed happen to lose the game to your opponent, but you will win what is better, his esteem, his respect, and his affection; together with the silent approbation and good will of impartial spectators."
    ]
  },
  {
    "slug": "the-lake-isle-of-innisfree",
    "title": "The Lake Isle of Innisfree",
    "author": "W. B. Yeats",
    "year": 1890,
    "shelf": "poem",
    "paragraphs": [
      "I will arise and go now, and go to Innisfree,\nAnd a small cabin build there, of clay and wattles made;\nNine bean-rows will I have there, a hive for the honey-bee,\nAnd live alone in the bee-loud glade.",
      "And I shall have some peace there, for peace comes dropping slow,\nDropping from the veils of the morning to where the cricket sings;\nThere midnight’s all a glimmer, and noon a purple glow,\nAnd evening full of the linnet’s wings.",
      "I will arise and go now, for always night and day\nI hear lake water lapping with low sounds by the shore;\nWhile I stand on the roadway, or on the pavements grey,\nI hear it in the deep heart’s core."
    ]
  },
  {
    "slug": "when-you-are-old",
    "title": "When You Are Old",
    "author": "W. B. Yeats",
    "year": 1893,
    "shelf": "poem",
    "paragraphs": [
      "When you are old and grey and full of sleep,\nAnd nodding by the fire, take down this book,\nAnd slowly read, and dream of the soft look\nYour eyes had once, and of their shadows deep;",
      "How many loved your moments of glad grace,\nAnd loved your beauty with love false or true,\nBut one man loved the pilgrim soul in you,\nAnd loved the sorrows of your changing face;",
      "And bending down beside the glowing bars,\nMurmur, a little sadly, how Love fled\nAnd paced upon the mountains overhead\nAnd hid his face amid a crowd of stars."
    ]
  },
  {
    "slug": "hope-is-the-thing-with-feathers",
    "title": "“Hope” is the thing with feathers",
    "author": "Emily Dickinson",
    "year": 1891,
    "shelf": "poem",
    "paragraphs": [
      "“Hope” is the thing with feathers -\nThat perches in the soul -\nAnd sings the tune without the words -\nAnd never stops - at all -",
      "And sweetest - in the Gale - is heard -\nAnd sore must be the storm -\nThat could abash the little Bird\nThat kept so many warm -",
      "I’ve heard it in the chillest land -\nAnd on the strangest Sea -\nYet - never - in Extremity,\nIt asked a crumb - of me."
    ]
  },
  {
    "slug": "because-i-could-not-stop-for-death",
    "title": "Because I could not stop for Death",
    "author": "Emily Dickinson",
    "year": 1890,
    "shelf": "poem",
    "paragraphs": [
      "Because I could not stop for Death –\nHe kindly stopped for me –\nThe Carriage held but just Ourselves –\nAnd Immortality.",
      "We slowly drove – He knew no haste\nAnd I had put away\nMy labor and my leisure too,\nFor His Civility –",
      "We passed the School, where Children strove\nAt Recess – in the Ring –\nWe passed the Fields of Gazing Grain –\nWe passed the Setting Sun –",
      "Or rather – He passed Us –\nThe Dews drew quivering and Chill –\nFor only Gossamer, my Gown –\nMy Tippet – only Tulle –",
      "We paused before a House that seemed\nA Swelling of the Ground –\nThe Roof was scarcely visible –\nThe Cornice – in the Ground –",
      "Since then – ’tis Centuries – and yet\nFeels shorter than the Day\nI first surmised the Horses’ Heads\nWere toward Eternity –"
    ]
  },
  {
    "slug": "a-noiseless-patient-spider",
    "title": "A Noiseless Patient Spider",
    "author": "Walt Whitman",
    "year": 1881,
    "shelf": "poem",
    "paragraphs": [
      "A noiseless patient spider,\nI mark’d where on a little promontory it stood isolated,\nMark’d how to explore the vacant vast surrounding,\nIt launch’d forth filament, filament, filament, out of itself,\nEver unreeling them, ever tirelessly speeding them.",
      "And you O my soul where you stand,\nSurrounded, detached, in measureless oceans of space,\nCeaselessly musing, venturing, throwing, seeking the spheres to connect them,\nTill the bridge you will need be form’d, till the ductile anchor hold,\nTill the gossamer thread you fling catch somewhere, O my soul."
    ]
  },
  {
    "slug": "the-negro-speaks-of-rivers",
    "title": "The Negro Speaks of Rivers",
    "author": "Langston Hughes",
    "year": 1921,
    "shelf": "poem",
    "paragraphs": [
      "I’ve known rivers:\nI’ve known rivers ancient as the world and older than the\nflow of human blood in human veins.",
      "My soul has grown deep like the rivers.",
      "I bathed in the Euphrates when dawns were young.\nI built my hut near the Congo and it lulled me to sleep.\nI looked upon the Nile and raised the pyramids above it.\nI heard the singing of the Mississippi when Abe Lincoln\nwent down to New Orleans, and I’ve seen its muddy\nbosom turn all golden in the sunset.",
      "I’ve known rivers:\nAncient, dusky rivers.",
      "My soul has grown deep like the rivers."
    ]
  },
  {
    "slug": "remember",
    "title": "Remember",
    "author": "Christina Rossetti",
    "year": 1862,
    "shelf": "poem",
    "paragraphs": [
      "Remember me when I am gone away,\nGone far away into the silent land;\nWhen you can no more hold me by the hand,\nNor I half turn to go yet turning stay.\nRemember me when no more day by day\nYou tell me of our future that you plann’d:\nOnly remember me; you understand\nIt will be late to counsel then or pray.\nYet if you should forget me for a while\nAnd afterwards remember, do not grieve:\nFor if the darkness and corruption leave\nA vestige of the thoughts that once I had,\nBetter by far you should forget and smile\nThan that you should remember and be sad."
    ]
  },
  {
    "slug": "when-i-have-fears",
    "title": "When I have fears that I may cease to be",
    "author": "John Keats",
    "year": 1848,
    "shelf": "poem",
    "paragraphs": [
      "When I have fears that I may cease to be\nBefore my pen has glean’d my teeming brain,\nBefore high-pilèd books, in charactery,\nHold like rich garners the full ripen’d grain;",
      "When I behold, upon the night’s starr’d face,\nHuge cloudy symbols of a high romance,\nAnd think that I may never live to trace\nTheir shadows, with the magic hand of chance;",
      "And when I feel, fair creature of an hour,\nThat I shall never look upon thee more,\nNever have relish in the faery power\nOf unreflecting love!—then on the shore\nOf the wide world I stand alone, and think\nTill love and fame to nothingness do sink."
    ]
  },
  {
    "slug": "to-the-hebrew-congregation-in-newport",
    "title": "To the Hebrew Congregation in Newport",
    "author": "George Washington",
    "year": 1790,
    "shelf": "letter",
    "paragraphs": [
      "Newport, Rhode Island, 18 August 1790.",
      "Gentlemen:",
      "While I receive, with much satisfaction, your Address replete with expressions of affection and esteem, I rejoice in the opportunity of assuring you, that I shall always retain a grateful remembrance of the cordial welcome I experienced in my visit to Newport, from all classes of Citizens.",
      "The reflection on the days of difficulty and danger which are past is rendered the more sweet, from a consciousness that they are succeeded by days of uncommon prosperity and security. If we have wisdom to make the best use of the advantages with which we are now favored, we cannot fail, under the just administration of a good Government, to become a great and a happy people.",
      "The Citizens of the United States of America have a right to applaud themselves for having given to mankind examples of an enlarged and liberal policy: a policy worthy of imitation. All possess alike liberty of conscience and immunities of citizenship. It is now no more that toleration is spoken of, as if it was by the indulgence of one class of people, that another enjoyed the exercise of their inherent natural rights. For happily the Government of the United States, which gives to bigotry no sanction, to persecution no assistance, requires only that they who live under its protection should demean themselves as good citizens, in giving it on all occasions their effectual support.",
      "It would be inconsistent with the frankness of my character not to avow that I am pleased with your favorable opinion of my Administration, and fervent wishes for my felicity. May the Children of the Stock of Abraham, who dwell in this land, continue to merit and enjoy the good will of the other Inhabitants; while every one shall sit in safety under his own vine and fig tree, and there shall be none to make him afraid. May the father of all mercies scatter light and not darkness in our paths, and make us all in our several vocations useful here, and in his own due time and way everlastingly happy.",
      "G. Washington"
    ]
  },
  {
    "slug": "letter-to-mrs-bixby",
    "title": "Letter to Mrs. Bixby",
    "author": "Abraham Lincoln",
    "year": 1864,
    "shelf": "letter",
    "paragraphs": [
      "Executive Mansion, Washington, November 21, 1864.",
      "Mrs. Bixby, Boston, Massachusetts.",
      "Dear Madam:",
      "I have been shown in the files of the War Department a statement of the Adjutant General of Massachusetts that you are the mother of five sons who have died gloriously on the field of battle.",
      "I feel how weak and fruitless must be any word of mine which should attempt to beguile you from the grief of a loss so overwhelming. But I cannot refrain from tendering you the consolation that may be found in the thanks of the Republic they died to save.",
      "I pray that our Heavenly Father may assuage the anguish of your bereavement, and leave you only the cherished memory of the loved and lost, and the solemn pride that must be yours to have laid so costly a sacrifice upon the altar of freedom.",
      "Yours, very sincerely and respectfully, A. Lincoln."
    ]
  },
  {
    "slug": "ozymandias",
    "title": "Ozymandias",
    "author": "Percy Bysshe Shelley",
    "year": 1818,
    "shelf": "poem",
    "paragraphs": [
      "I met a traveller from an antique land,\nWho said—“Two vast and trunkless legs of stone\nStand in the desert. . . . Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command,\nTell that its sculptor well those passions read\nWhich yet survive, stamped on these lifeless things,\nThe hand that mocked them, and the heart that fed;\nAnd on the pedestal, these words appear:\nMy name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away.”"
    ]
  },
  {
    "slug": "the-new-colossus",
    "title": "The New Colossus",
    "author": "Emma Lazarus",
    "year": 1883,
    "shelf": "poem",
    "paragraphs": [
      "Not like the brazen giant of Greek fame,\nWith conquering limbs astride from land to land;\nHere at our sea-washed, sunset gates shall stand\nA mighty woman with a torch, whose flame\nIs the imprisoned lightning, and her name\nMother of Exiles. From her beacon-hand\nGlows world-wide welcome; her mild eyes command\nThe air-bridged harbor that twin cities frame.\n“Keep, ancient lands, your storied pomp!” cries she\nWith silent lips. “Give me your tired, your poor,\nYour huddled masses yearning to breathe free,\nThe wretched refuse of your teeming shore.\nSend these, the homeless, tempest-tost to me,\nI lift my lamp beside the golden door!”"
    ]
  },
  {
    "slug": "invictus",
    "title": "Invictus",
    "author": "William Ernest Henley",
    "year": 1875,
    "shelf": "poem",
    "paragraphs": [
      "Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.",
      "In the fell clutch of circumstance\nI have not winced nor cried aloud.\nUnder the bludgeonings of chance\nMy head is bloody, but unbowed.",
      "Beyond this place of wrath and tears\nLooms but the Horror of the shade,\nAnd yet the menace of the years\nFinds, and shall find, me unafraid.",
      "It matters not how strait the gate,\nHow charged with punishments the scroll,\nI am the master of my fate,\nI am the captain of my soul."
    ]
  },
  {
    "slug": "a-psalm-of-life",
    "title": "A Psalm of Life",
    "author": "Henry Wadsworth Longfellow",
    "year": 1838,
    "shelf": "poem",
    "paragraphs": [
      "Tell me not, in mournful numbers,\nLife is but an empty dream!\nFor the soul is dead that slumbers,\nAnd things are not what they seem.",
      "Life is real! Life is earnest!\nAnd the grave is not its goal;\nDust thou art, to dust returnest,\nWas not spoken of the soul.",
      "Not enjoyment, and not sorrow,\nIs our destined end or way;\nBut to act, that each to-morrow\nFind us farther than to-day.",
      "Art is long, and Time is fleeting,\nAnd our hearts, though stout and brave,\nStill, like muffled drums, are beating\nFuneral marches to the grave.",
      "In the world's broad field of battle,\nIn the bivouac of Life,\nBe not like dumb, driven cattle!\nBe a hero in the strife!",
      "Trust no Future, howe'er pleasant!\nLet the dead Past bury its dead!\nAct,—act in the living Present!\nHeart within, and God o'erhead!",
      "Lives of great men all remind us\nWe can make our lives sublime,\nAnd, departing, leave behind us\nFootprints on the sands of time;",
      "Footprints, that perhaps another,\nSailing o'er life's solemn main,\nA forlorn and shipwrecked brother,\nSeeing, shall take heart again.",
      "Let us, then, be up and doing,\nWith a heart for any fate;\nStill achieving, still pursuing,\nLearn to labor and to wait."
    ]
  },
  {
    "slug": "a-dream-within-a-dream",
    "title": "A Dream Within a Dream",
    "author": "Edgar Allan Poe",
    "year": 1849,
    "shelf": "poem",
    "paragraphs": [
      "Take this kiss upon the brow!\nAnd, in parting from you now,\nThus much let me avow—\nYou are not wrong, who deem\nThat my days have been a dream;\nYet if hope has flown away\nIn a night, or in a day,\nIn a vision, or in none,\nIs it therefore the less gone?\nAll that we see or seem\nIs but a dream within a dream.",
      "I stand amid the roar\nOf a surf-tormented shore,\nAnd I hold within my hand\nGrains of the golden sand—\nHow few! yet how they creep\nThrough my fingers to the deep,\nWhile I weep—while I weep!\nO God! can I not grasp\nThem with a tighter clasp?\nO God! can I not save\nOne from the pitiless wave?\nIs all that we see or seem\nBut a dream within a dream?"
    ]
  },
  {
    "slug": "annabel-lee",
    "title": "Annabel Lee",
    "author": "Edgar Allan Poe",
    "year": 1849,
    "shelf": "poem",
    "paragraphs": [
      "It was many and many a year ago,\nIn a kingdom by the sea,\nThat a maiden there lived whom you may know\nBy the name of Annabel Lee;\nAnd this maiden she lived with no other thought\nThan to love and be loved by me.",
      "I was a child and she was a child,\nIn this kingdom by the sea,\nBut we loved with a love that was more than love—\nI and my Annabel Lee—\nWith a love that the wingèd seraphs of Heaven\nCoveted her and me.",
      "And this was the reason that, long ago,\nIn this kingdom by the sea,\nA wind blew out of a cloud, chilling\nMy beautiful Annabel Lee;\nSo that her highborn kinsmen came\nAnd bore her away from me,\nTo shut her up in a sepulchre\nIn this kingdom by the sea.",
      "The angels, not half so happy in Heaven,\nWent envying her and me—\nYes! that was the reason (as all men know,\nIn this kingdom by the sea)\nThat the wind came out of the cloud by night,\nChilling and killing my Annabel Lee.",
      "But our love it was stronger by far than the love\nOf those who were older than we—\nOf many far wiser than we—\nAnd neither the angels in Heaven above\nNor the demons down under the sea\nCan ever dissever my soul from the soul\nOf the beautiful Annabel Lee.",
      "For the moon never beams, without bringing me dreams\nOf the beautiful Annabel Lee;\nAnd the stars never rise, but I feel the bright eyes\nOf the beautiful Annabel Lee;\nAnd so, all the night-tide, I lie down by the side\nOf my darling—my darling—my life and my bride,\nIn her sepulchre there by the sea—\nIn her tomb by the sounding sea."
    ]
  }
];
