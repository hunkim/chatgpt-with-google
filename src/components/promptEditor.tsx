import { h } from 'preact'
import { useState, useEffect, useRef, useLayoutEffect } from 'preact/hooks'
import { getTranslation, localizationKeys } from 'src/util/localization'
import { deletePrompt, getDefaultPrompt, getSavedPrompts, Prompt, savePrompt } from 'src/util/promptManager'
import TooltipWrapper from './tooltipWrapper'

const PromptEditor = (
    props: {
        language: string
    }
) => {
    const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([])
    const [prompt, setPrompt] = useState<Prompt>(getDefaultPrompt())
    const [hasWebResultsPlaceholder, setHasWebResultsPlaceholder] = useState(false)
    const [hasQueryPlaceholder, setHasQueryPlaceholder] = useState(false)
    const [deleteBtnText, setDeleteBtnText] = useState("delete")

    const [showErrors, setShowErrors] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [textError, setTextError] = useState(false)
    const [webResultsError, setWebResultsError] = useState(false)
    const [queryError, setQueryError] = useState(false)

    useLayoutEffect(() => {
        updateSavedPrompts()
    }, [])

    const updateSavedPrompts = async () => {
        let prompts = await getSavedPrompts()
        setSavedPrompts(prompts)
        if (prompt.uuid === 'default') {
            setPrompt(prompts[0])
        }
    }

    useEffect(() => {
        updateSavedPrompts()
    }, [props.language])

    useEffect(() => {
        updatePlaceholderButtons(prompt.text)
    }, [prompt])

    useEffect(() => {
        setNameError(prompt.name.trim() === '')
        setTextError(prompt.text.trim() === '')
        setWebResultsError(!prompt.text.includes('{web_results}'))
        setQueryError(!prompt.text.includes('{query}'))
    }, [prompt])

    async function updateList() {
        getSavedPrompts().then(sp => {
            setSavedPrompts(sp)
        })
    }

    const handleSelect = (prompt: Prompt) => {
        setShowErrors(false)
        setPrompt(prompt)
        setDeleteBtnText("delete")
    }


    const handleAdd = () => {
        setShowErrors(false)
        setPrompt({ name: '', text: '' })
        setDeleteBtnText("delete")
        if (nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }

    const handleSave = async () => {
        setShowErrors(true)
        if (nameError || textError || webResultsError || queryError) {
            return
        }

        await savePrompt(prompt)
        await updateList()
    }

    const handleDeleteBtnClick = () => {
        if (deleteBtnText === "delete") {
            setDeleteBtnText("check");
        } else {
            handleDelete();
        }
    }

    const handleDelete = async () => {
        await deletePrompt(prompt)
        updateList()
        handleAdd()
    }


    const nameInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleInsertText = (text: string) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart
            const end = textareaRef.current.selectionEnd
            const currentText = textareaRef.current.value
            const newText = currentText.substring(0, start) + text + currentText.substring(end, currentText.length)
            textareaRef.current.setSelectionRange(start + text.length, start + text.length)
            textareaRef.current.focus()

            setPrompt({ ...prompt, text: newText })
        }
    }

    const handleTextareaChange = (e: Event) => {
        let text = (e.target as HTMLTextAreaElement).value
        if (text !== prompt.text) {
            setTextError(false)
            setPrompt({ ...prompt, text: text })
        }
    }

    const updatePlaceholderButtons = (text: string) => {
        setHasWebResultsPlaceholder(text.includes("{web_results}"))
        setHasQueryPlaceholder(text.includes("{query}"))
    }

    const actionToolbar = (
        <div className={`wcg-flex wcg-flex-row wcg-justify-between wcg-mt-4
                        ${prompt.uuid === 'default' || prompt.uuid === 'default_en' ? "wcg-hidden" : ""}`}
        >
            <div className="wcg-flex wcg-flex-row wcg-gap-4">
                <TooltipWrapper tip={showErrors ? getTranslation(localizationKeys.placeHolderTips.webResults) : ""}>
                    <button
                        className={`wcg-btn
                        ${showErrors && webResultsError ? "wcg-btn-error" : hasWebResultsPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        wcg-lowercase wcg-p-1`}
                        onClick={() => {
                            setWebResultsError(false)
                            handleInsertText('{web_results}')
                        }}
                    >
                        &#123;web_results&#125;
                    </button>
                </TooltipWrapper>
                <TooltipWrapper tip={showErrors ? getTranslation(localizationKeys.placeHolderTips.query) : ""}>
                    <button
                        className={`wcg-btn
                        ${showErrors && queryError ? "wcg-btn-error" : hasQueryPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        wcg-lowercase wcg-p-1`}
                        onClick={() => {
                            setQueryError(false)
                            handleInsertText('{query}')
                        }}
                    >
                        &#123;query&#125;
                    </button>
                </TooltipWrapper>
                <TooltipWrapper tip={getTranslation(localizationKeys.placeHolderTips.currentDate)}>
                    <button
                        className="wcg-btn wcg-btn-success wcg-lowercase wcg-p-1"
                        onClick={() => handleInsertText('{current_date}')}
                    >
                        &#123;current_date&#125;
                    </button>
                </TooltipWrapper>
            </div>

            <button
                className="wcg-btn wcg-btn-primary wcg-text-base"
                onClick={handleSave}
            >
                {getTranslation(localizationKeys.buttons.save)}
            </button>
        </div >
    )

    const PromptList = (
        <div>
            <ul className="wcg-menu wcg-p-0 wcg-max-h-96 wcg-scroll-m-0 wcg-scroll-y wcg-overflow-auto wcg-mt-4
                    wcg-flex wcg-flex-col wcg-flex-nowrap
                    wcg-border-solid wcg-border-2 wcg-border-white/20">
                {savedPrompts.map((prmpt: Prompt) => (
                    <li
                        key={prmpt.uuid}
                        onClick={() => handleSelect(prmpt)}
                    >
                        <a className={`wcg-text-base ${prmpt.uuid === prompt.uuid ? 'wcg-active' : ''}`}>
                            📝 {prmpt.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )

    const nameInput = (
        <input
            ref={nameInputRef}
            className={`wcg-input wcg-input-bordered wcg-flex-1
                        ${showErrors && nameError ? "wcg-input-error" : ""}`
            }
            placeholder={getTranslation(localizationKeys.placeholders.namePlaceholder)}
            value={prompt.name}
            onInput={(e: Event) => {
                setNameError(false)
                setPrompt({ ...prompt, name: (e.target as HTMLInputElement).value })
            }}
            disabled={prompt.uuid === 'default' || prompt.uuid === 'default_en'}
        />
    )

    const btnDelete = (
        <button
            className={`wcg-btn wcg-text-base
                    ${deleteBtnText === "check" ? "wcg-btn-error" : "wcg-btn-primary"}
                    ${prompt.uuid === 'default' || prompt.uuid === 'default_en' ? "wcg-hidden" : ""}`}
            onClick={handleDeleteBtnClick}
        >
            <span class="material-symbols-outlined">
                {deleteBtnText}
            </span>
        </button>
    )

    const textArea = (
        <textarea
            ref={textareaRef}
            className={`wcg-textarea wcg-textarea-bordered
                        ${showErrors && textError ? "wcg-textarea-error" : ""}
                        wcg-h-96 wcg-resize-none wcg-text-base wcg-mt-2`}
            value={prompt.text}
            onInput={handleTextareaChange}
            // disabled={prompt.uuid === 'default' || prompt.uuid === 'default_en'}
        />
    )

    return (
        <div className="wcg-w-4/5 wcg-border wcg-rounded-box wcg-py-4 wcg-flex wcg-flex-row wcg-gap-4 wcg-h-[32rem] wcg-mt-10">
            <div className="wcg-w-1/3">
                {PromptList}
            </div>

            <div className="wcg-flex wcg-flex-col wcg-w-2/3">
                <div className="wcg-flex wcg-flex-row wcg-gap-2 wcg-items-center">
                    {nameInput}
                    {btnDelete}
                </div>
                {textArea}

                {actionToolbar}
            </div>
        </div >
    )
}

export default PromptEditor
