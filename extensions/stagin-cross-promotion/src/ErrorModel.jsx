import { Module } from "module"

const ErrorModel=()=>{
  return 		<Link
  overlay={
    <Modal
      id="error-modal"
      padding
      title=""
    >
      <TextBlock>
      Oops sorry, that didn’t quite work.
      </TextBlock>
      <TextBlock>
      please select your offers, enter your email and then click ‘send offers’
      </TextBlock>
      <Button
        onPress={() =>
          ui.overlay.close('error-modal')
        }
      >
        Close
      </Button>
    </Modal>
  }
>
  Return policy
</Link>
}

export default ErrorModel;